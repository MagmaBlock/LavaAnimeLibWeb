import { App } from "../../app";
import nodePathPosix from "node:path/posix";
import { LibraryService } from "../service";
import type { StorageSystem } from "../system/interface";
import pLimit from "p-limit";
import pathTool from "path/posix";
import type { Storage, StorageIndex } from "@prisma/client";

export class StorageIndexManager {
  private storageSystem: StorageSystem;
  constructor(storage: Storage) {
    this.storageSystem = App.instance.services
      .getService(LibraryService)
      .getStorageSystem(storage);
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
  async getFileList(path: string): Promise<StorageIndex[]> {
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
  async getFileListWithNoAnime(path: string): Promise<StorageIndex[]> {
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

  getStorageReader(): StorageSystem {
    return this.storageSystem;
  }
  /**
   * 对 Library 进行全盘扫描, 数据库中的记录同步删改
   * @param rootPath 根路径
   */
  public async scan(rootPath: string) {
    const scanedRecords: number[] = [];
    await this.scanLikeATree(rootPath, scanedRecords);

    const removed = await App.instance.prisma.storageIndex.updateMany({
      data: { removed: true },
      where: {
        storageId: this.storageSystem.storage.id,
        id: { notIn: scanedRecords },
        removed: false,
        path: { startsWith: rootPath },
      },
    });

    App.instance.logger.info(
      `${this.storageSystem.storage.name}(${this.storageSystem.storage.id}) - ${rootPath} 中成功扫描到了 ${scanedRecords.length} 个文件(夹)，已经标记删除了数据库中 ${removed.count} 条本次扫描未扫描到的记录.`
    );
  }

  /**
   * 递归扫描器
   * @param rootPath
   * @param scanedRecords 已扫描到的文件记录的数组. 在此传入一个数组 (的引用), 每次递归迭代时会向其中添加已扫描记录的 ID
   */
  protected async scanLikeATree(rootPath: string, scanedRecords: number[]) {
    App.instance.logger.trace(
      `${this.storageSystem.storage.name}(${this.storageSystem.storage.id}) 扫描 ${rootPath}`
    );

    await this.updateIndex(rootPath);
    const root = await this.getFileList(rootPath);

    root.forEach((record) => {
      scanedRecords.push(record.id);
    });

    const limit = pLimit(4);
    const tasks = [];

    for (const child of root) {
      // 文件没有子目录, 跳过
      if (child.isDirectory === false) continue;
      const thisChildPath = pathTool.join(rootPath, child.name);
      // 递归扫描
      tasks.push(limit(() => this.scanLikeATree(thisChildPath, scanedRecords)));
    }

    await Promise.all(tasks);
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
    const storageIndexs = await this.getFileList(path);

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
          `${this.storageSystem.storage.id} 删除 ${index.path}${index.name}`
        );
      }
    }
  }
}
