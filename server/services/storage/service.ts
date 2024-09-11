import type {
  AnimeSiteLink,
  PrismaClient,
  Storage,
  StorageIndex,
} from "@prisma/client";
import type { StorageScrapeResult } from "~/server/services/storage/scraper/types/result";
import { App } from "../app";
import { StorageIndexManager } from "./index/manager";
import type { StorageScraper } from "./scraper/interface";
import { LavaAnimeLibV2Scraper } from "./scraper/v2";
import { AlistStorageSystem } from "./system/alist";
import type { StorageSystem } from "./system/interface";

export class StorageService {
  private readonly prisma = App.instance.prisma;

  /**
   * 获取 Storage 对象
   * @param storageId Storage 的 id
   * @returns Storage 对象
   */
  async getStorage(storageId: string): Promise<Storage | null> {
    return await this.prisma.storage.findUnique({
      where: { id: storageId },
    });
  }

  /**
   * 获取所有 Storage
   */
  async getAllStorage(): Promise<Storage[]> {
    const storages = await this.prisma.storage.findMany();
    return storages.filter((s) => s !== null);
  }

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
   * 将 StorageScrapeResult 的结果生效到数据库中
   * @param result 由 StorageScraper 挂削出的结果
   */
  async applyStorageScraperResult(result: StorageScrapeResult): Promise<void> {
    if (result.createAnime && result.updateAnime) {
      throw new Error(
        "StorageScrapeResult 中不能同时存在 createAnime 和 updateAnime"
      );
    }

    let animeId: number | undefined;

    if (result.createAnime) {
      if (!result.createAnime.name) {
        throw new Error(
          "StorageScrapeResult 申请创建 Anime, 缺少必选字段 name."
        );
      }

      const newAnime = await this.prisma.anime.create({
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

      App.instance.logger.trace(
        "[applyStorageScraperResult] 创建 Anime",
        newAnime
      );

      animeId = newAnime.id;
    }

    if (result.updateAnime) {
      if (!result.updateAnime.animeId) {
        throw new Error(
          "StorageScrapeResult 申请更新 Anime, 但没有提供 animeId."
        );
      }

      await this.prisma.anime.update({
        where: { id: result.updateAnime.animeId },
        data: result.updateAnime.data,
      });

      App.instance.logger.trace(
        "[applyStorageScraperResult] 更新 Anime",
        result.updateAnime
      );

      animeId = result.updateAnime.animeId;
    }

    if (result.connectSites) {
      if (!animeId && !result.connectSites.animeId) {
        throw new Error(
          "StorageScrapeResult 申请更新 AnimeSiteLink, 但没有提供 animeId."
        );
      }

      await this.createSitesToAnime(
        result.connectSites.sites,
        animeId || result.connectSites.animeId!
      );
    }

    if (result.connectFiles) {
      if (!animeId && !result.connectFiles.animeId) {
        throw new Error(
          "StorageScrapeResult 申请更新 AnimeFileLink, 但没有提供 animeId."
        );
      }

      await this.connectFilesToAnime(
        result.connectFiles.files,
        animeId || result.connectFiles.animeId!
      );
    }
  }

  private async createSitesToAnime(
    sites: Partial<AnimeSiteLink>[],
    animeId: number
  ) {
    const connectSites = sites.map((s) => {
      if (!s.siteType || !s.siteId) {
        throw new Error(
          "StorageScrapeResult 申请创建 AnimeSiteLink, 但甚至没有提供 siteType 或 siteId."
        );
      }
      return {
        siteType: s.siteType,
        siteId: s.siteId,
      };
    });

    await this.prisma.anime.update({
      where: { id: animeId },
      data: {
        sites: {
          createMany: {
            data: connectSites,
          },
        },
      },
    });

    App.instance.logger.trace(
      "[applyStorageScraperResult] 更新 AnimeSiteLink",
      connectSites
    );
  }

  private async connectFilesToAnime(files: StorageIndex[], animeId: number) {
    const connectFiles = files.map((f) => {
      return { id: f.id };
    });

    await this.prisma.anime.update({
      where: { id: animeId },
      data: {
        files: {
          connect: connectFiles,
        },
      },
    });

    App.instance.logger.trace(
      "[applyStorageScraperResult] 更新 AnimeFileLink",
      connectFiles
    );
  }

  /**
   * 获取 StorageIndex 对应的文件的临时下载链接
   * @throws Storage 不存在时掷出
   * @throws Storage 获取临时下载链接失败时掷出
   */
  async getFileTempUrl(file: StorageIndex): Promise<string> {
    const storage = await this.getStorage(file.storageId);
    if (storage === null) {
      throw new Error("Storage 不存在");
    }
    const storageSystem = this.getStorageSystem(storage);
    const indexManager = this.getIndexManager(storage);
    const filePath = indexManager.getFilePath(file);
    const url = await storageSystem.getDownloadUrl(filePath);
    if (url === null) {
      throw new Error(`获取文件 ${filePath} 的临时下载链接失败`);
    }
    return url;
  }
}
