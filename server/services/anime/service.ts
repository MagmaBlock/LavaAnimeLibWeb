import type { AnimeInfoSource } from "@prisma/client";
import pLimit from "p-limit";
import { App } from "../app";
import { AnimeEpisodeFileLinker } from "./episode/file-linker";
import { BangumiAnimeInfoUpdater } from "./info/updater/bangumi";
import type { AnimeInfoUpdater } from "./info/updater/interface";

/**
 * 用于创建新番和管理番剧文件列表的工具类
 */
export class AnimeService {
  /**
   * 使用更新器更新指定动画的信息。
   *
   * 此函数查询指定动画的所有站点信息，并对每个过时的站点调用相应的更新器进行信息更新。
   * @param animeId 需要更新的动画ID。
   */
  async updateAnimesInfo(animeIds: number[]): Promise<void> {
    const animes = await App.instance.prisma.anime.findMany({
      where: {
        id: {
          in: animeIds,
        },
      },
      include: {
        sites: true,
      },
    });

    const updatersCache = new Map<AnimeInfoSource, AnimeInfoUpdater>();
    const limit = pLimit(4);
    const tasks = [];

    for (const anime of animes) {
      for (const site of anime.sites) {
        const updater = updatersCache.has(site.siteType)
          ? updatersCache.get(site.siteType)
          : this.getSiteInfoUpdater(site.siteType);

        if (!updater) continue;

        tasks.push(limit(() => updater.updateRelationAnimes(site)));
      }
    }

    const result = await Promise.allSettled(tasks);
    const errors = result.filter(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult[];
    if (errors.length) {
      App.instance.logger.warn(
        `更新动画关联站点信息时，有 ${errors.length} 个失败.`
      );
    }
  }

  /**
   * 更新上次更新时间点之前的所有动画信息。
   *
   * 此函数查询出所有需要更新的动画，然后调用 updateAnimeInfos 方法进行批量更新。
   * @param before 指定的时间点，用于筛选需要更新的动画信息。
   */
  async updateAllAnimeInfoBefore(before: Date): Promise<void> {
    // 查询需要更新的动画列表
    const animeNeedToUpdate = await App.instance.prisma.anime.findMany({
      where: {
        sites: {
          some: {
            OR: [{ updatedAt: { lte: before } }, { updatedAt: null }],
          },
        },
      },
      select: { id: true },
    });

    await this.updateAnimesInfo(animeNeedToUpdate.map((anime) => anime.id));

    App.instance.logger.info(
      `更新库内所有番剧的第三方站点资料数据完成. (${before.toLocaleString()} 前)`
    );
  }

  /**
   * 根据网站类型获取对应的动画信息更新器。
   *
   * @param siteType 动画信息来源的网站类型。
   * @returns 如果指定了有效的网站类型，返回相应的动画信息更新器实例；否则返回 undefined。
   */
  getSiteInfoUpdater(siteType: AnimeInfoSource) {
    if (siteType === "Bangumi") return new BangumiAnimeInfoUpdater();
  }

  /**
   * 获取用于连接文件与 AnimeEpisode 的工具类。
   */
  getAnimeEpisodeFileLinker() {
    return new AnimeEpisodeFileLinker();
  }
}
