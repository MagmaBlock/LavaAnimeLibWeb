import { App } from "../../app";
import nodePathPosix from "node:path/posix";
import { StorageService } from "../service";
import type { StorageSystem } from "../system/interface";
import pLimit from "p-limit";
import pathTool from "path/posix";
import type { Storage, StorageIndex } from "@prisma/client";

export class StorageIndexManager {
  public storage: Storage;
  private storageSystem: StorageSystem;
  private readonly concurrencyLimit = 4;
  constructor(storage: Storage) {
    this.storageSystem = App.instance.services
      .getService(StorageService)
      .getStorageSystem(storage);
    this.storage = this.storageSystem.storage;
  }

  /**
   * 使用绝对路径获取某个文件/文件夹的信息
   * @param path 绝对路径
   * @returns
   */
  async getFileInfo(path: string): Promise<StorageIndex | null> {
    const parsePath = nodePathPosix.parse(path);

    return await App.instance.prisma.storageIndex.findUnique({
      where: {
        name_path_storageId: {
          name: parsePath.base,
          path: parsePath.dir,
          storageId: this.storageSystem.storage.id,
        },
        removed: false,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹
   */
  async getDirContents(path: string): Promise<StorageIndex[]> {
    path = nodePathPosix.join(path);

    return await App.instance.prisma.storageIndex.findMany({
      where: {
        storageId: this.storageSystem.storage.id,
        removed: false,
        path,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的所有子文件/文件夹
   * @param path
   */
  async getFilesStartsWith(path: string): Promise<StorageIndex[]> {
    path = nodePathPosix.join(path);

    return await App.instance.prisma.storageIndex.findMany({
      where: {
        storageId: this.storageSystem.storage.id,
        removed: false,
        path: { startsWith: path },
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹(但仅限没有 anime 归属的)
   */
  async getDirContentsNoAnimeBind(path: string): Promise<StorageIndex[]> {
    path = nodePathPosix.join(path);

    return await App.instance.prisma.storageIndex.findMany({
      where: {
        storageId: this.storageSystem.storage.id,
        removed: false,
        path,
        animeId: null,
      },
    });
  }

  /**
   * 传入一个文件夹路径，本方法将会把此文件夹下的文件(夹)索引到数据库
   * @param path
   * @returns
   */
  async updateIndex(path: string): Promise<void> {
    // 最新的文件列表, 若失败将掷出错误
    const storageFiles = await this.storageSystem.list(path);

    /**
     * 遍历 storageFiles，将其插入或更新到数据库
     */
    for (const storageFile of storageFiles) {
      if (storageFile.name === undefined || storageFile.path === undefined)
        continue;

      await App.instance.prisma.storageIndex.upsert({
        where: {
          name_path_storageId: {
            name: storageFile.name,
            path: storageFile.path,
            storageId: this.storageSystem.storage.id,
          },
        },
        update: {
          type: storageFile.type,
          isDirectory: storageFile.isDirectory,
          size: storageFile.size,
          removed: false,
          lastFoundAt: new Date(),
        },
        create: {
          name: storageFile.name,
          path: storageFile.path,
          storageId: this.storageSystem.storage.id,
          type: storageFile.type,
          isDirectory: storageFile.isDirectory,
          size: storageFile.size,
          removed: false,
          lastFoundAt: new Date(),
        },
      });
    }

    /**
     * 将更新后的索引和文件系统列出的列表进行对比
     * 若此 path 下的文件(夹)不存在，则会将文件标记为 "removed"
     *
     * P.S. 这里只能删除到调用此函数时传入的 path 的子文件、子文件夹
     *      若数据库中包含有上级目录已经被删除的文件(夹)，则不是在这里删除的。
     *      (是在 this.scan() 完成的)
     */
    const storageIndexs = await this.getDirContents(path);

    // 遍历数据库中当前库路径中所有未删除的文件
    for (const index of storageIndexs) {
      // 在 Alist 中查找此文件
      const thisFileInStorageFiles = storageFiles.find(
        (file) => file.name === index.name
      );

      // 如果此 Index 的文件在 StorageSystem 中不存在，将文件标记为 "removed"
      if (thisFileInStorageFiles === undefined) {
        await App.instance.prisma.storageIndex.update({
          where: {
            name_path_storageId: {
              storageId: index.storageId,
              path: index.path,
              name: index.name,
            },
          },
          data: {
            removed: true,
          },
        });
        App.instance.logger.trace(
          `${this.storageSystem.storage.id} 的文件 ${index.path}/${index.name} 因消失已标记为 "removed"`
        );
      }
    }
  }

  /**
   * 对 Library 进行全盘扫描, 数据库中的记录同步删改
   * @param rootPath 根路径
   */
  public async scan(rootPath: string) {
    const scannedRecords = new Set<number>();
    await this.scanRecursively(rootPath, scannedRecords);

    this.logScanResult(rootPath, scannedRecords.size);
  }

  /**
   * 递归扫描器
   * @param currentPath 当前扫描的路径
   * @param scannedRecords 已扫描到的文件记录的集合
   */
  private async scanRecursively(
    currentPath: string,
    scannedRecords: Set<number>
  ) {
    App.instance.logger.trace(
      `${this.storageSystem.storage.id} 扫描 ${currentPath}`
    );

    await this.updateIndex(currentPath);
    const currentDirContents = await this.getDirContents(currentPath);

    currentDirContents.forEach((record) => scannedRecords.add(record.id));

    const limit = pLimit(this.concurrencyLimit);
    const subDirectoryScans = currentDirContents
      .filter((item) => item.isDirectory)
      .map((dir) => {
        const subDirPath = pathTool.join(currentPath, dir.name);
        return limit(() => this.scanRecursively(subDirPath, scannedRecords));
      });

    await Promise.all(subDirectoryScans);
  }

  /**
   * 标记数据库中已删除的记录
   * @param rootPath 根路径
   * @param scannedRecords 已扫描到的记录集合
   * @deprecated
   * @returns 被标记为删除的记录数量
   */
  private async markIndexsRemoved(
    rootPath: string,
    scannedRecords: Set<number>
  ): Promise<number> {
    const result = await App.instance.prisma.storageIndex.updateMany({
      data: { removed: true },
      where: {
        storageId: this.storageSystem.storage.id,
        id: { notIn: Array.from(scannedRecords) },
        removed: false,
        path: { startsWith: rootPath },
      },
    });

    return result.count;
  }

  /**
   * 记录扫描结果
   * @param rootPath 根路径
   * @param scannedCount 扫描到的记录数量
   * @param removedCount 标记为删除的记录数量
   */
  private logScanResult(rootPath: string, scannedCount: number) {
    App.instance.logger.info(
      `${this.storageSystem.storage.name}(${this.storageSystem.storage.id}) - ${rootPath} 中成功扫描到了 ${scannedCount} 个文件(夹).`
    );
  }
}
