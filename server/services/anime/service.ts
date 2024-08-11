import type { EpisodeConnectResult } from "~/server/types/library/file/episode/connector";
import { App } from "../app";
import { LibraryFileEpisodeConnector } from "../library/file/episode/connector";

/**
 * 用于创建新番和管理番剧文件列表的工具类
 */
export class AnimeService {
  /**
   * 将 Anime 的 LibFile 与 AnimeEpisode 关联。
   * 此函数接收一个 Anime id 列表，查询这些动漫的信息及其文件，并尝试将这些文件与相应的剧集关联起来。
   */
  async connectAnimeFileWithEpisode(
    animeIDs: number[]
  ): Promise<EpisodeConnectResult[]> {
    const animes = await App.instance.prisma.anime.findMany({
      where: {
        id: {
          in: animeIDs,
        },
      },
      include: {
        files: true,
      },
    });

    const allResult = [];

    for (const anime of animes) {
      console.log("anime", anime);

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
