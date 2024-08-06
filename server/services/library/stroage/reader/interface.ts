import type { LibraryIndexUpdater } from "../../index/updater";
import type { LibraryScraper } from "../../scraper/interface";
import type { LibraryIndexReader } from "../../index/reader";
import type { Library, LibFile } from "@prisma/client";

/**
 * 资源库工具的接口
 * 能够实现对资源库的一些阅读等操作
 */
export interface StorageReader {
  library: Library;

  /**
   * 实时扫描一个路径，会将其内容存储至数据库并返回相关 LibFile
   * @param path
   */
  updateIndex(path: string): Promise<LibFile[]>;

  /**
   * 获取此 Library 应当使用的扫描器
   */
  getScanner(): LibraryIndexUpdater;

  /**
   * 获取此 Library 应当使用的挂削器
   */
  getScraper(): LibraryScraper;

  /**
   * 获取此 Library 的读取器
   */
  getReader(): LibraryIndexReader;
}
