import {
  AnimeInfoSource,
  AnimePlatform,
  EpisodeType,
  type AnimeSiteLink,
} from "@prisma/client";
import moment from "moment";
import { BangumiAPI } from "~/server/services/api/bangumi";
import { App } from "~/server/services/app";
import type {
  BangumiAPIEpisode,
  BangumiAPIEpisodes,
  BangumiAPISubject,
} from "~/server/services/api/types/bangumi";
import type { AnimeInfoUpdater } from "./interface";

/**
 * 从番组计划获取番剧信息并刷新数据库数据
 */
export class BangumiAnimeInfoUpdater implements AnimeInfoUpdater {
  private bangumiAPI = new BangumiAPI();

  async updateRelationAnimes(siteLink: AnimeSiteLink): Promise<void> {
    if (siteLink === null) throw new Error("AnimeSiteLink 为 null");
    if (siteLink.siteType !== "Bangumi") {
      throw new Error("获取关联站点信息时，适配器选用错误");
    }
    if (Number(siteLink.siteId) <= 0) return;

    const [bangumiSubject, bangumiEpisodes] = await Promise.all([
      this.bangumiAPI.getSubjects(Number(siteLink.siteId)),
      this.bangumiAPI.getEpisodes(Number(siteLink.siteId)),
    ]);

    await Promise.all([
      this.updateAnimePoster(siteLink.animeId, bangumiSubject),
      this.updateAnime(siteLink.animeId, bangumiSubject),
      this.updateAnimeTags(siteLink.animeId, bangumiSubject),
      this.updateRating(siteLink.animeId, bangumiSubject),
      this.updateAnimeEpisodes(siteLink.animeId, bangumiEpisodes),
      this.changeUpdateTime(siteLink.id),
    ]);
  }

  private async updateAnimePoster(
    animeId: number,
    bangumiSubject: BangumiAPISubject
  ) {
    const images = bangumiSubject.images;
    if (images) {
      await App.instance.prisma.animePicture.upsert({
        where: {
          type_animeId: {
            animeId: animeId,
            type: "Poster",
          },
        },
        create: {
          url: images.large,
          type: "Poster",
          animeId: animeId,
        },
        update: {
          url: images.large,
        },
      });

      await App.instance.prisma.animePicture.upsert({
        where: {
          type_animeId: {
            animeId: animeId,
            type: "SmallPoster",
          },
        },
        create: {
          url: images.common,
          type: "SmallPoster",
          animeId: animeId,
        },
        update: {
          url: images.common,
        },
      });
      App.instance.logger.trace(`更新了番剧 ${animeId} 的海报.`);
    }
  }

  /**
   * 从 Bangumi 获取到的分集信息更新 AnimeEpisode
   * @param animeId
   * @param bangumiEpisodes
   */
  private async updateAnimeEpisodes(
    animeId: number,
    bangumiEpisodes: BangumiAPIEpisodes
  ) {
    for (const bangumiEpisode of bangumiEpisodes.data) {
      await App.instance.prisma.animeEpisode.upsert({
        where: {
          animeId_type_episodeDisplay: {
            animeId,
            type: this.bangumiEpisodeTypeToDBType(bangumiEpisode),
            episodeDisplay: bangumiEpisode.sort,
          },
        },
        update: {
          episodeIndex: bangumiEpisode.ep,
          name: bangumiEpisode.name_cn || null,
          originalName: bangumiEpisode.name || null,
          summary: bangumiEpisode.desc || null,
          airDate: bangumiEpisode.airdate || null,
          duration:
            bangumiEpisode.duration_seconds ??
            moment.duration(bangumiEpisode.duration).asSeconds(),
          source: "Bangumi",
        },
        create: {
          episodeDisplay: bangumiEpisode.sort,
          episodeIndex: bangumiEpisode.ep,
          type: this.bangumiEpisodeTypeToDBType(bangumiEpisode),
          name: bangumiEpisode.name_cn || null,
          originalName: bangumiEpisode.name || null,
          summary: bangumiEpisode.desc || null,
          airDate: bangumiEpisode.airdate || null,
          duration:
            bangumiEpisode.duration_seconds ??
            moment.duration(bangumiEpisode.duration).asSeconds(),
          animeId,
          source: "Bangumi",
        },
      });
    }
    App.instance.logger.trace(
      `已从 Bangumi 更新 anime ${animeId} 的 ${bangumiEpisodes.data.length} 个剧集数据.`
    );
  }

  private bangumiEpisodeTypeToDBType(
    bangumiEpisode: BangumiAPIEpisode
  ): EpisodeType {
    if (bangumiEpisode.type === 0) return "Normal";
    if (bangumiEpisode.type === 1) return "SP";
    if (bangumiEpisode.type === 2) return "OP";
    if (bangumiEpisode.type === 3) return "ED";
    return "Other";
  }

  /**
   * 在数据库里更新 AnimeSiteLink 的 lastUpdate 字段
   * @param animeId
   */
  private async changeUpdateTime(animeSiteId: number) {
    await App.instance.prisma.animeSiteLink.update({
      where: {
        id: animeSiteId,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 更新番剧信息
   */
  private async updateAnime(
    animeId: number,
    bangumiSubject: BangumiAPISubject
  ) {
    let platform: AnimePlatform = "Other";
    if (bangumiSubject.platform === "TV") platform = "TV";
    else if (bangumiSubject.platform === "剧场版") platform = "Movie";
    else if (bangumiSubject.platform === "OVA") platform = "OVA";
    else if (bangumiSubject.platform === "WEB") platform = "Web";

    await App.instance.prisma.anime.update({
      where: {
        id: animeId,
      },
      data: {
        originalName: bangumiSubject.name,
        summary: bangumiSubject.summary,
        platform,
        date: moment(bangumiSubject.date).toDate(),
      },
    });

    App.instance.logger.trace(`从 Bangumi 更新了番剧 ${animeId} 的基础信息.`);
  }

  /**
   * 更新番剧的 Banugmi 标签
   */
  private async updateAnimeTags(
    animeId: number,
    bangumiSubject: BangumiAPISubject
  ) {
    const currentDate = new Date();

    // 获取新的标签
    const newTags = bangumiSubject.tags.map((tag) => ({
      name: tag.name,
      count: tag.count,
      source: AnimeInfoSource.Bangumi,
      lastFoundAt: currentDate,
      animeId: animeId,
    }));

    // 获取数据库中现有的标签
    const existingTags = await App.instance.prisma.animeTag.findMany({
      where: { animeId, source: AnimeInfoSource.Bangumi },
    });

    // 更新或创建标签
    for (const newTag of newTags) {
      await App.instance.prisma.animeTag.upsert({
        where: {
          name_source_animeId: {
            name: newTag.name,
            source: AnimeInfoSource.Bangumi,
            animeId,
          },
        },
        update: {
          count: newTag.count,
          lastFoundAt: currentDate,
        },
        create: newTag,
      });
    }

    // 删除不再存在的标签
    const newTagNames = new Set(newTags.map((tag) => tag.name));
    for (const existingTag of existingTags) {
      if (!newTagNames.has(existingTag.name)) {
        await App.instance.prisma.animeTag.delete({
          where: {
            id: existingTag.id,
          },
        });
      }
    }

    App.instance.logger.trace(`从 Bangumi 更新了番剧 ${animeId} 的最新标签.`);
  }

  /**
   * 更新番剧的评分
   */
  private async updateRating(
    animeId: number,
    bangumiSubject: BangumiAPISubject
  ) {
    await App.instance.prisma.animeRating.upsert({
      where: {
        animeId_source: {
          animeId: animeId,
          source: AnimeInfoSource.Bangumi,
        },
      },
      update: {
        score: bangumiSubject.rating.score,
        rank: bangumiSubject.rating.rank,
        count: bangumiSubject.rating.total,
      },
      create: {
        score: bangumiSubject.rating.score,
        rank: bangumiSubject.rating.rank,
        count: bangumiSubject.rating.total,
        animeId: animeId,
        source: AnimeInfoSource.Bangumi,
      },
    });

    App.instance.logger.trace(`更新了番剧 ${animeId} 的最新 Bangumi 评分`);
  }
}
