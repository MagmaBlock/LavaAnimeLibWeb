import type { Library } from "@prisma/client";
import type { LibraryScrapeResult } from "~/server/types/library/scraper/result";
import { App } from "../app";
import { AlistStorageReader } from "./stroage/reader/alist";
import type { StorageReader } from "./stroage/reader/interface";

export class LibraryService {
  async getStoragesForAllLibrary(): Promise<StorageReader[]> {
    const librarys = await App.instance.prisma.library.findMany();
    const allStorages = librarys.map((library) => {
      return this.getStorageReader(library);
    });
    return allStorages.filter((storage) => storage !== null);
  }

  getStorageReader(library: Library): StorageReader | null {
    if (library.type === "Alist") return new AlistStorageReader(library);
    return null;
  }

  /**
   * 将 LibraryScrapeResult 的结果生效到数据库中
   * @param result 由 LibraryScraper 挂削出的结果
   */
  async applyLibraryScraperResult(result: LibraryScrapeResult): Promise<void> {
    // 创建新番
    if (result.anime.id === undefined) {
      try {
        const animeCreate = await App.instance.prisma.anime.create({
          data: {
            name: result.anime.name,
            originalName: result.anime.originalName,
            bdrip: result.anime.bdrip,
            nsfw: result.anime.nsfw,
            platform: result.anime.platform,
            date: result.anime.date,
            releaseYear: result.anime.releaseYear,
            releaseSeason: result.anime.releaseSeason,
            region: result.anime.region,
          },
        });
        App.instance.logger.info(`创建新番 ${result.anime.name}`);

        // 为新番添加站点链接
        for (const siteLink of result.anime.sites) {
          await App.instance.prisma.anime.update({
            where: { id: animeCreate.id },
            data: {
              sites: {
                connectOrCreate: {
                  where: { siteId_siteType: { ...siteLink } },
                  create: { ...siteLink },
                },
              },
            },
          });
          App.instance.logger.trace(
            `${result.anime.name} -> ${siteLink.siteType} ${siteLink.siteId}`
          );
        }

        // 为新番添加所有文件
        const { count } = await App.instance.prisma.libFile.updateMany({
          where: { id: { in: result.files.map((file) => file.id) } },
          data: { animeId: animeCreate.id },
        });
        App.instance.logger.trace(
          `${result.anime.name} 关联到 ${count} 个文件`
        );
      } catch (error) {
        App.instance.logger.error(error, "创建新番时发生错误");
      }
    }

    // 链接老番
    if (result.anime.id !== undefined) {
      try {
        // 为老番添加所有文件
        const { count } = await App.instance.prisma.libFile.updateMany({
          where: { id: { in: result.files.map((file) => file.id) } },
          data: { animeId: result.anime.id },
        });
        App.instance.logger.trace(
          `${result.anime.name} 关联到 ${count} 个文件`
        );
      } catch (error) {
        App.instance.logger.error(error, "链接老番时发生错误");
      }
    }
  }
}
