import type { LibFile, Library } from "@prisma/client";
import { App } from "../../app";
import nodePath from "node:path/posix";
import { LibraryService } from "../service";
import type { LibraryStorageSystem } from "../stroage/system/interface";
import pLimit from "p-limit";
import pathTool from "path/posix";

export class LibraryIndexManager {
  private storageReader: LibraryStorageSystem;
  constructor(library: Library) {
    this.storageReader = App.instance.services
      .getService(LibraryService)
      .getStorageSystem(library);
  }

  /**
   * 使用绝对路径获取某个文件/文件夹的信息
   * @param path 绝对路径
   * @returns
   */
  async getFile(path: string): Promise<LibFile | null> {
    const parsePath = nodePath.parse(path);

    return await App.instance.prisma.libFile.findUnique({
      where: {
        uniqueFileInLib: {
          libraryId: this.storageReader.library.id,
          path: parsePath.dir,
          name: parsePath.base,
        },
        removed: false,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹
   */
  async getFirstSubFiles(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的所有子文件/文件夹
   * @param path
   */
  async getAllSubFiles(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path: { startsWith: path },
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹(但仅限没有 anime 归属的)
   */
  async getFirstSubFilesWithNoAnime(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path,
        animeId: null,
      },
    });
  }

  getStorageReader(): LibraryStorageSystem {
    return this.storageReader;
  }
  /**
   * 对 Library 进行全盘扫描, 数据库中的记录同步删改
   * @param rootPath 根路径
   */
  public async scan(rootPath: string) {
    const scanedRecords: number[] = [];
    await this.scanLikeATree(rootPath, scanedRecords);

    const removed = await App.instance.prisma.libFile.updateMany({
      data: { removed: true },
      where: {
        libraryId: this.storageReader.library.id,
        id: { notIn: scanedRecords },
        removed: false,
        path: { startsWith: rootPath },
      },
    });

    App.instance.logger.info(
      `${this.storageReader.library.name}(${this.storageReader.library.id}) - ${rootPath} 中成功扫描到了 ${scanedRecords.length} 个文件(夹)，已经标记删除了数据库中 ${removed.count} 条本次扫描未扫描到的记录.`
    );
  }

  /**
   * 递归扫描器
   * @param rootPath
   * @param scanedRecords 已扫描到的文件记录的数组. 在此传入一个数组 (的引用), 每次递归迭代时会向其中添加已扫描记录的 ID
   */
  protected async scanLikeATree(rootPath: string, scanedRecords: number[]) {
    App.instance.logger.trace(
      `${this.storageReader.library.name}(${this.storageReader.library.id}) 扫描 ${rootPath}`
    );
    let root = await this.storageReader.updateIndex(rootPath);

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
}
