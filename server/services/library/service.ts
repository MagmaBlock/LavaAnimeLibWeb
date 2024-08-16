import type { Library } from "@prisma/client";
import type { LibraryScrapeResult } from "~/server/types/library/scraper/result";
import { App } from "../app";
import type { LibraryScraper } from "./scraper/interface";
import { AlistStorageSystem } from "./stroage/system/alist";
import type { LibraryStorageSystem } from "./stroage/system/interface";
import { LavaAnimeLibV2LibraryScraper } from "./scraper/v2";
import { LibraryIndexManager } from "./index/manager";

export class LibraryService {
  /**
   * 获取所有 Library
   */
  async getAllLibrary(): Promise<Library[]> {
    const librarys = await App.instance.prisma.library.findMany();
    return librarys.filter((library) => library !== null);
  }

  /**
   * 获取资源库的索引管理器
   */
  getIndexManager(library: Library): LibraryIndexManager {
    return new LibraryIndexManager(library);
  }

  /**
   * 传入 Library，获取对应的底层文件系统实现
   * @throws 找不到文件系统实现时掷出
   */
  getStorageSystem(library: Library): LibraryStorageSystem {
    if (library.type === "Alist") return new AlistStorageSystem(library);
    throw new Error("不支持的 Library 类型");
  }

  /**
   * 获取 Library 的挂削器。依据是 Library 的 structure 字段
   * @throws 找不到对应的挂削器实现时掷出
   */
  getScraper(library: Library): LibraryScraper {
    if (library.structure === "LavaAnimeLibV2")
      return new LavaAnimeLibV2LibraryScraper(library);
    throw new Error("不支持的 Library 类型");
  }

  /**
   * 将 LibraryScrapeResult 的结果生效到数据库中
   * @param result 由 LibraryScraper 挂削出的结果
   */
  async applyLibraryScraperResult(result: LibraryScrapeResult): Promise<void> {
    // // 创建新番
    // if (result.anime.id === undefined) {
    //   try {
    //     const animeCreate = await App.instance.prisma.anime.create({
    //       data: {
    //         name: result.anime.name,
    //         originalName: result.anime.originalName,
    //         bdrip: result.anime.bdrip,
    //         nsfw: result.anime.nsfw,
    //         platform: result.anime.platform,
    //         date: result.anime.date,
    //         releaseYear: result.anime.releaseYear,
    //         releaseSeason: result.anime.releaseSeason,
    //         region: result.anime.region,
    //       },
    //     });
    //     App.instance.logger.info(`创建新番 ${result.anime.name}`);
    //     // 为新番添加站点链接
    //     for (const siteLink of result.anime.sites) {
    //       await App.instance.prisma.anime.update({
    //         where: { id: animeCreate.id },
    //         data: {
    //           sites: {
    //             connectOrCreate: {
    //               where: {
    //                 siteType_siteId_animeId: {
    //                   ...siteLink,
    //                   animeId: animeCreate.id,
    //                 },
    //               },
    //               create: { ...siteLink },
    //             },
    //           },
    //         },
    //       });
    //       App.instance.logger.trace(
    //         `${result.anime.name} -> ${siteLink.siteType} ${siteLink.siteId}`
    //       );
    //     }
    //     // 为新番添加所有文件
    //     const { count } = await App.instance.prisma.libFile.updateMany({
    //       where: { id: { in: result.files.map((file) => file.id) } },
    //       data: { animeId: animeCreate.id },
    //     });
    //     App.instance.logger.trace(
    //       `${result.anime.name} 关联到 ${count} 个文件`
    //     );
    //   } catch (error) {
    //     App.instance.logger.error(error, "创建新番时发生错误");
    //   }
    // }
    // // 链接老番
    // if (result.anime.id !== undefined) {
    //   try {
    //     // 为老番添加所有文件
    //     const { count } = await App.instance.prisma.libFile.updateMany({
    //       where: { id: { in: result.files.map((file) => file.id) } },
    //       data: { animeId: result.anime.id },
    //     });
    //     App.instance.logger.trace(
    //       `${result.anime.name} 关联到 ${count} 个文件`
    //     );
    //   } catch (error) {
    //     App.instance.logger.error(error, "链接老番时发生错误");
    //   }
    // }
  }
}
