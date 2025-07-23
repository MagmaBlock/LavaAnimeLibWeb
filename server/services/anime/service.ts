import type { AnimeInfoSource } from "@prisma/client";
import pLimit from "p-limit";
import { App } from "../app";
import { BangumiAnimeInfoUpdater } from "./info/updater/bangumi";
import { prisma } from "~/server/src/context/prisma";

/**
 * 用于创建新番和管理番剧文件列表的工具类
 */
export class AnimeService {
  /**
   * 更新指定动画的信息。
   *
   * @param animeIds 需要更新的动画ID数组。
   * @description
   * 1. 查询指定动画的所有站点信息
   * 2. 对每个站点调用相应的更新器进行信息更新
   * 3. 使用并发限制控制同时进行的更新任务数
   * 4. 记录更新过程中的错误
   */
  async updateAnimesInfo(animeIds: number[]): Promise<void> {
    const animes = await prisma.anime.findMany({
      where: {
        id: {
          in: animeIds,
        },
      },
      include: {
        sites: true,
      },
    });

    const limit = pLimit(4);
    const tasks = [];

    for (const anime of animes) {
      for (const site of anime.sites) {
        const updater = this.getSiteInfoUpdater(site.siteType);
        if (!updater) continue;

        tasks.push(limit(() => updater.updateAnimeInfo(site)));
      }
    }

    const result = await Promise.allSettled(tasks);

    // 寻找更新过程中的错误
    const errors = result.filter(
      (r) => r.status === "rejected",
    ) as PromiseRejectedResult[];
    if (errors.length) {
      App.instance.logger.warn(
        `更新动画关联站点信息时，有 ${errors.length} 个失败.`,
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
    const animeNeedToUpdate = await prisma.anime.findMany({
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
      `更新库内所有番剧的第三方站点资料数据完成. (${before.toLocaleString()} 前)`,
    );
  }

  /**
   * 更新指定动画的信息，如果该动画的最后更新时间早于指定时间。
   *
   * @param animeId 需要更新的动画ID
   * @param before 指定的时间点，用于判断是否需要更新
   * @returns 如果动画有信息被更新，返回true；否则返回false
   */
  async updateAnimeInfoBefore(animeId: number, before: Date): Promise<boolean> {
    const anime = await prisma.anime.findUnique({
      where: { id: animeId },
      include: { sites: true },
    });

    if (!anime) throw new Error(`动画 ${animeId} 不存在`);

    const sitesToUpdate = anime.sites.filter(
      (site) => !site.updatedAt || site.updatedAt <= before,
    );

    if (sitesToUpdate.length === 0) return false;

    for (const site of sitesToUpdate) {
      const updater = this.getSiteInfoUpdater(site.siteType);
      if (!updater) continue;

      await updater.updateAnimeInfo(site);
      await prisma.animeSiteLink.update({
        where: { id: site.id },
        data: { updatedAt: new Date() },
      });
    }

    return true;
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
}
