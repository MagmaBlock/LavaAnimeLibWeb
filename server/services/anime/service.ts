import type { EpisodeConnectResult } from "~/server/types/library/file/episode/connector";
import { App } from "../app";
import { LibraryFileEpisodeConnector } from "../library/file/episode/connector";
import type { AnimeInfoSource } from "@prisma/client";
import { BangumiAnimeInfoUpdater } from "./info/updater/bangumi";
import pLimit from "p-limit";

/**
 * 用于创建新番和管理番剧文件列表的工具类
 */
export class AnimeService {
  /**
   * 更新指定动画的信息。
   *
   * @param animeId 需要更新的动画ID。
   * 此函数查询指定动画的所有站点信息，并对每个过时的站点调用相应的更新器进行信息更新。
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

    for (const anime of animes) {
      for (const site of anime.sites) {
        // 对于每一个站点，调用相应的更新器进行信息更新
        const updater = this.getSiteInfoUpdater(site.siteType);
        if (!updater) {
          App.instance.logger.warn(
            `动画 ${anime.id} ${anime.name} 的关联数据源 ${site.siteType} 没有更新器实现`
          );
          continue;
        }

        await updater.updateRelationAnimes(site.id);
      }
    }
  }

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
            OR: [{ updatedAt: { lte: before } }, { updatedAt: null }],
          },
        },
      },
      select: { id: true },
    });

    const limit = pLimit(2);

    await Promise.all(
      animeNeedToUpdate.map((anime) =>
        limit(() => this.updateAnimesInfo([anime.id]))
      )
    );

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
   * 将 Anime 的 LibFile 与 AnimeEpisode 关联。
   * 此函数接收一个 Anime id 列表，查询这些动漫的信息及其文件，并尝试将这些文件与相应的剧集关联起来。
   */
  async connectAnimeFileWithEpisode(
    animeIds: number[]
  ): Promise<EpisodeConnectResult[]> {
    const animes = await App.instance.prisma.anime.findMany({
      where: {
        id: {
          in: animeIds,
        },
      },
      include: {
        files: true,
      },
    });

    const allResult = [];

    for (const anime of animes) {
      const result = await new LibraryFileEpisodeConnector().connect(
        anime.files
      );

      allResult.push(result);
    }
    return allResult;
  }

  /**
   * 将所有 Anime 的 LibFile 与 AnimeEpisode 关联。
   */
  async connectAllAnimeFileWithEpisode() {
    const allAnimeIds = await App.instance.prisma.anime.findMany({
      select: { id: true },
    });

    await this.connectAnimeFileWithEpisode(
      allAnimeIds.map((anime) => anime.id)
    );
  }
}
