import type { Storage, StorageIndex } from "@prisma/client";

/**
 * 资源库的文件系统访问接口
 * 能够实现对文件系统的基础操作
 */
export interface StorageSystem {
  storage: Storage;

  /**
   * 新建文件夹。
   *
   * 对于部分不支持此方法的存储系统实现，将什么也不会发生
   * @param path
   */
  mkdir(path: string): Promise<void>;
  /**
   * 复制文件
   *
   * @param path 源文件的路径
   * @param targetFolder 目标文件夹，不含文件名
   */
  copy(path: string, targetFolder: string): Promise<void>;
  /**
   * 移动文件
   * @param path 源文件的路径
   * @param targetFolder 目标文件夹，不含文件名
   */
  move(path: string, targetFolder: string): Promise<void>;
  /**
   * 列出指定文件夹内容
   * @param path
   */
  list(path: string): Promise<Partial<StorageIndex>[]>;
  /**
   * 查询文件/文件夹信息
   * @param path
   */
  info(path: string): Promise<Partial<StorageIndex>>;
  /**
   * 在文件系统上删除文件
   * @param path
   */
  remove(path: string): Promise<void>;

  readFile(path: string): Promise<Buffer | null>;
  readFileStream(path: string): Promise<ReadableStream | null>;
  readFileString(path: string): Promise<string | null>;

  uploadFromBuffer(path: string, buffer: Buffer): Promise<void>;

  getUploadUrl(path: string): Promise<string | null>;
  getDownloadUrl(path: string): Promise<string | null>;
}
