import type { AnimeInfoSource } from "@prisma/client";
import { App } from "../../app";
import { BangumiAnimeInfoUpdater } from "./updater/bangumi";
import pLimit from "p-limit";

export class AnimeInfoService {
  /**
   * 更新指定时间点之前的所有动画信息。
   *
   * @param before 指定的时间点，用于筛选需要更新的动画信息。
   * 此函数查询出所有需要更新的动画，然后调用 updateAnimeInfos 方法进行批量更新。
   */
  async updateAllAnimeInfoBefore(before: Date): Promise<void> {
    // 查询需要更新的动画列表
    const animeNeedToUpdate = await App.instance.prisma.anime.findMany({
      where: {
        sites: {
          some: {
            OR: [{ lastUpdate: { lte: before } }, { lastUpdate: null }],
          },
        },
      },
      select: { id: true },
    });

    const limit = pLimit(2);

    await Promise.all(
      animeNeedToUpdate.map((anime) =>
        limit(() => this.updateAnimeInfo(anime.id))
      )
    );

    App.instance.logger.info(
      `更新库内所有番剧的第三方站点资料数据完成. (${before.toLocaleString()} 前)`
    );
  }

  /**
   * 更新指定动画的信息。
   *
   * @param animeId 需要更新的动画ID。
   * 此函数查询指定动画的所有站点信息，并对每个过时的站点调用相应的更新器进行信息更新。
   */
  async updateAnimeInfo(animeId: number): Promise<void> {
    const anime = await App.instance.prisma.anime.findUnique({
      where: {
        id: animeId,
      },
      include: {
        sites: true,
      },
    });

    if (!anime) {
      throw new Error(`无法找到 ID 为 ${animeId} 的动画.`);
    }

    // 对于每一个站点，调用相应的更新器进行信息更新
    for (const site of anime.sites) {
      const updater = this.getSiteInfoUpdater(site.siteType);
      if (!updater) {
        App.instance.logger.warn(
          `无法找到 ${site.siteType} 的更新器，无法更新 ${site.siteId} 的信息.`
        );
        continue;
      }

      await updater.updateRelationAnimes(site.siteId);
    }

    App.instance.logger.info(
      `更新动画 ID ${animeId} 的第三方站点资料数据完成.`
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
}
