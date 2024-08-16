import type { LibFile, Library } from "@prisma/client";

/**
 * 资源库的文件系统访问接口
 * 能够实现对文件系统的基础操作
 */
export interface LibraryStorageSystem {
  library: Library;

  /**
   * 实时扫描一个路径，会将其内容存储至数据库并返回相关 LibFile
   * @param path
   */
  updateIndex(path: string): Promise<LibFile[]>;
}
