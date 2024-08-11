import pathTool from "path/posix";
import { App } from "../../app";
import type { StorageReader } from "../stroage/reader/interface";

/**
 * 操纵 LibraryTool 类对资源库存储器进行扫描
 * 本类中的方法均是对数据库的写方法
 */
export class LibraryIndexUpdater {
  private storageReader: StorageReader;

  constructor(libraryTool: StorageReader) {
    this.storageReader = libraryTool;
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

    for (const child of root) {
      // 文件没有子目录, 跳过
      if (child.isDirectory === false) continue;
      const thisChildPath = pathTool.join(rootPath, child.name);
      // 递归扫描
      await this.scanLikeATree(thisChildPath, scanedRecords);
    }
  }

  getStorageReader(): StorageReader {
    return this.storageReader;
  }
}
