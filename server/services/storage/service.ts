import type { Storage } from "@prisma/client";
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
    if (result.createAnime) {
      if (result.createAnime.name === undefined) {
        throw new Error(
          "StorageScrapeResult 申请创建 Anime, 但甚至没有提供 name."
        );
      }

      await prisma.anime.create({
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
    }
  }
}
