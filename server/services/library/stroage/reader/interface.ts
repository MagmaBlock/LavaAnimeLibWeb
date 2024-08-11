import type { LibFile, Library } from "@prisma/client";
import type { LibraryIndexReader } from "../../index/reader";
import type { LibraryIndexUpdater } from "../../index/updater";
import type { LibraryScraper } from "../../scraper/interface";

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
   * 获取此 Library 应当使用的索引更新器
   */
  getIndexUpdater(): LibraryIndexUpdater;

  /**
   * 获取此 Library 应当使用的挂削器
   */
  getScraper(): LibraryScraper;

  /**
   * 获取此 Library 应当使用的索引读取器
   */
  getIndexReader(): LibraryIndexReader;
}
