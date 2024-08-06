import { LavaAnimeLibV2LibraryScraper } from "./v2";
import type { StorageReader } from "../stroage/reader/interface";
import type { LibraryScrapeResult } from "~/server/types/library/scraper/result";

/**
 * 资源库挂削器
 * 本接口定义了一种挂削器，会按照一定的规范来根据数据库内记录的 LibFile 文件记录判断文件属于什么作品
 */
export interface LibraryScraper {
  libraryTool: StorageReader;

  /**
   * 对指定路径开始的所有文件/文件夹进行挂削
   * 返回挂削结果集 (LibraryScraperResult)
   */
  scrapeLibrary(pathStartsWith: string): Promise<LibraryScrapeResult[]>;
}

/**
 * 自动根据 LibraryTool 的 structure 字段获取相应挂削器
 * @param libraryTool
 * @returns
 */
export function scraperFactory(libraryTool: StorageReader): LibraryScraper {
  if (libraryTool.library.structure === "LavaAnimeLibV2") {
    return new LavaAnimeLibV2LibraryScraper(libraryTool);
  }
  throw new Error("Unknown library structure");
}
