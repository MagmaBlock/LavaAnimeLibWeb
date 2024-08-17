import type {
  AnimeSiteLink,
  PrismaClient,
  Storage,
  StorageIndex,
} from "@prisma/client";
import type { StorageScrapeResult } from "~/server/types/storage/scraper/result";
import { App } from "../app";
import { StorageIndexManager } from "./index/manager";
import type { StorageScraper } from "./scraper/interface";
import { LavaAnimeLibV2Scraper } from "./scraper/v2";
import { AlistStorageSystem } from "./system/alist";
import type { StorageSystem } from "./system/interface";

export class StorageService {
  /**
   * 获取资源库的索引管理器
   */
  getIndexManager(storage: Storage): StorageIndexManager {
    return new StorageIndexManager(storage);
  }

  /**
   * 获取 Storage 的挂削器。依据是 Storage 的 structure 字段
   * @throws 找不到对应的挂削器实现时掷出
   */
  getScraper(storage: Storage): StorageScraper {
    if (storage.bindScraper === "LavaAnimeLibV2")
      return new LavaAnimeLibV2Scraper(storage);
    throw new Error("不支持的 Storage 类型");
  }

  /**
   * 传入 Storage，获取对应的底层文件系统实现
   * @throws 找不到文件系统实现时掷出
   */
  getStorageSystem(storage: Storage): StorageSystem {
    if (storage.type === "Alist") return new AlistStorageSystem(storage);
    throw new Error("不支持的 Storage 类型");
  }

  /**
   * 获取所有 Storage
   */
  async getAllStorage(): Promise<Storage[]> {
    const storages = await App.instance.prisma.storage.findMany();
    return storages.filter((s) => s !== null);
  }

  /**
   * 将 StorageScrapeResult 的结果生效到数据库中
   * @param result 由 StorageScraper 挂削出的结果
   */
  async applyStorageScraperResult(result: StorageScrapeResult): Promise<void> {
    const prisma = App.instance.prisma;
    if (result.createAnime && result.updateAnime) {
      throw new Error(
        "StorageScrapeResult 中不能同时存在 createAnime 和 updateAnime"
      );
    }

    if (result.createAnime) {
      if (result.createAnime.name === undefined) {
        throw new Error(
          "StorageScrapeResult 申请创建 Anime, 缺少必选字段 name."
        );
      }

      const newAnime = await prisma.anime.create({
        data: {
          name: result.createAnime.name,
          originalName: result.createAnime.originalName,
          summary: result.createAnime.summary,
          createdAt: result.createAnime.createdAt,
          bdrip: result.createAnime.bdrip,
          nsfw: result.createAnime.nsfw,
          platform: result.createAnime.platform,
          date: result.createAnime.date,
          releaseYear: result.createAnime.releaseYear,
          releaseSeason: result.createAnime.releaseSeason,
          region: result.createAnime.region,
        },
      });

      if (result.connectSites) {
        await createSitesToAnime(
          result.connectSites.sites,
          newAnime.id,
          prisma
        );
      }

      if (result.connectFiles) {
        await connectFilesToAnime(
          result.connectFiles.files,
          newAnime.id,
          prisma
        );
      }
    }

    if (result.updateAnime) {
      if (result.updateAnime.animeId === undefined) {
        throw new Error(
          "StorageScrapeResult 申请更新 Anime, 但没有提供 animeId."
        );
      }

      await prisma.anime.update({
        where: { id: result.updateAnime.animeId },
        data: result.updateAnime.data,
      });

      if (result.connectSites) {
        await createSitesToAnime(
          result.connectSites.sites,
          result.updateAnime.animeId,
          prisma
        );
      }

      if (result.connectFiles) {
        await connectFilesToAnime(
          result.connectFiles.files,
          result.updateAnime.animeId,
          prisma
        );
      }
    }

    async function createSitesToAnime(
      sites: Partial<AnimeSiteLink>[],
      animeId: number,
      prisma: PrismaClient
    ) {
      const connectSites = sites.map((s) => {
        if (s.siteType === undefined || s.siteId === undefined) {
          throw new Error(
            "StorageScrapeResult 申请创建 AnimeSiteLink, 但甚至没有提供 siteType 或 siteId."
          );
        }
        return {
          siteType: s.siteType,
          siteId: s.siteId,
        };
      });

      await prisma.anime.update({
        where: { id: animeId },
        data: {
          sites: {
            createMany: {
              data: connectSites,
            },
          },
        },
      });
    }

    async function connectFilesToAnime(
      files: StorageIndex[],
      animeId: number,
      prisma: PrismaClient
    ) {
      const connectFiles = files.map((f) => {
        return { id: f.id };
      });

      await prisma.anime.update({
        where: { id: animeId },
        data: {
          files: {
            connect: connectFiles,
          },
        },
      });
    }
  }
}
