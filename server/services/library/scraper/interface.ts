import type { LibFile } from "@prisma/client";
import type { LibraryScrapeResult } from "~/server/types/library/scraper/result";

/**
 * 资源库挂削器
 * 本接口定义了一种挂削器，与 LibraryStructure 属性对应。
 * 能够根据 LibFile 文件索引，识别出文件可能的动画信息，并返回具有指令意味的 LibraryScrapeResult
 */
export interface LibraryScraper {
  /**
   * 对指定路径开始的所有文件/文件夹进行挂削
   * 返回挂削结果集 (LibraryScraperResult)
   *
   * @param pathStartsWith 挂削开始的路径。此值即使指定，实现类也能够接触文件在存储库的完整路径。
   */
  scrapeStartsWith(pathStartsWith: string): Promise<LibraryScrapeResult[]>;

  /**
   * 对文件进行挂削
   * @param files LibFile 数组
   */
  scrapeFiles(files: LibFile[]): Promise<LibraryScrapeResult[]>;
}
