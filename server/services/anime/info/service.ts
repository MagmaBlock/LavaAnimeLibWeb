import type { AnimeInfoSource } from "@prisma/client";
import { BangumiAnimeInfoUpdater } from "./updater/bangumi";

export class AnimeInfoService {
  /**
   * 自动更新所有在指定时间之前最后更新的动画信息。
   * @param before 指定的时间点，用于筛选需要更新的动画信息。
   * 此函数首先查询出所有需要更新的动画及其站点信息，然后针对每个过时的站点，
   * 调用相应的更新器来更新该站点下所有关联的动画作品信息。
   */
  async updateAllInfo(before: Date) {
    // 查询需要更新的动画列表，包含每个动画的所有站点信息
    const animeNeedToUpdate = await usePrisma.anime.findMany({
      where: {
        sites: {
          some: {
            OR: [{ lastUpdate: { lte: before } }, { lastUpdate: null }],
          },
        },
      },
      include: {
        sites: true,
      },
    });

    // 筛选出所有站点中需要更新的站点
    const allSitesOutdated = animeNeedToUpdate.flatMap((anime) => {
      const thisAnimeSitesOutdated = anime.sites.filter((site) => {
        if (site.lastUpdate === null || site.lastUpdate <= before) {
          return true;
        }
      });

      return thisAnimeSitesOutdated;
    });

    // 对于每一个过时的站点，调用相应的更新器进行信息更新
    for (const site of allSitesOutdated) {
      const updater = this.getInfoUpdater(site.siteType);
      if (!updater) {
        logger.warn(
          `无法找到 ${site.siteType} 的更新器，无法更新 ${site.siteId} 的信息.`
        );
        continue;
      }

      logger.info(
        `正在更新 ${site.siteType} ${site.siteId} 在库内所有相关作品的信息.`
      );

      await updater.updateRelationAnimes(site.siteId);
    }

    logger.info(
      `更新库内所有番剧的第三方站点资料数据完成. (${before.toLocaleString()} 前)`
    );
  }

  /**
   * 根据网站类型获取对应的动画信息更新器。
   *
   * @param siteType 动画信息来源的网站类型，是一个枚举类型（例如："Bangumi"）。
   * @returns 如果指定了有效的网站类型，返回一个相应的动画信息更新器实例；否则，不返回任何内容。
   */
  getInfoUpdater(siteType: AnimeInfoSource) {
    if (siteType === "Bangumi") return new BangumiAnimeInfoUpdater();
  }
}
