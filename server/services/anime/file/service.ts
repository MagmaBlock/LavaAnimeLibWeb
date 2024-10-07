import type { StorageIndex } from "@prisma/client";
import { App } from "../../app";
import { hash, objectHash } from "ohash";
import { SimilarFiles } from "./types/similar-files";

/**
 * 本类主要管理动画的文件服务，减轻前端在处理动画文件时的压力
 */
export class AnimeFileService {
  private readonly prisma = App.instance.prisma;

  /**
   * 获取指定 AnimeEpisode 的 SimilarFiles
   *
   * 本方法返回一个 SimilarFiles 数组，每个 SimilarFiles 包含来自不同存储器的相同文件
   * @param animeEpisodeId 要获取的 AnimeEpisode 的 ID
   * @returns 归类后的文件列表，每个 SimilarFiles 包含来自不同存储器的相同文件
   */
  async getAnimeEpisodeFiles(animeEpisodeId: number): Promise<SimilarFiles[]> {
    // 查询指定的 AnimeEpisode，同时获取相关联的文件和动画信息
    // 1. 获取 AnimeEpisode 本身的信息
    // 2. 包含与该 AnimeEpisode 直接关联的文件（files）
    // 3. 包含与该 AnimeEpisode 直接关联的 Anime 信息
    // 4. 获取该 Anime 下所有未被删除、非目录、且未关联到任何 AnimeEpisode 的文件
    // （因为 SimilarFiles 中的部分文件可能未被及时关联到集数，这时我们也将这些文件带上）
    // 这样可以在一次查询中获取所有需要的数据，避免多次数据库查询
    const animeEpisode = await this.prisma.animeEpisode.findFirst({
      where: {
        id: animeEpisodeId,
      },
      include: {
        files: {
          where: {
            removed: false,
          },
        },
        anime: {
          include: {
            files: {
              where: {
                removed: false,
                isDirectory: false,
                episodes: {
                  none: {},
                },
              },
            },
          },
        },
      },
    });

    if (!animeEpisode) {
      return [];
    }

    // 如果 Anime 是 NSFW，那么需要将不允许 NSFW 的存储器的文件过滤掉
    if (animeEpisode.anime.nsfw) {
      const noNSFWStorages = await this.prisma.storage.findMany({
        where: { noNSFW: true },
        select: { id: true },
      });
      const noNSFWIds: string[] = noNSFWStorages.map((item) => item.id);

      // 过滤掉不允许 NSFW 的存储器的文件
      animeEpisode.files = animeEpisode.files.filter(
        (file) => !noNSFWIds.includes(file.storageId)
      );
    }

    // 获取已关联到该剧集的文件ID集合
    const linkedFileIds = new Set(animeEpisode.files.map((file) => file.id));

    // 合并已关联和未关联的文件
    const allFiles = [...animeEpisode.files, ...animeEpisode.anime.files];

    // 使用优化后的 groupSimilarFiles 方法
    const groupedResult = this.groupSimilarFiles(allFiles);

    // 过滤掉全部未关联的组
    return groupedResult.filter((group) =>
      group.files.some((file) => linkedFileIds.has(file.id))
    );
  }

  /**
   * 获取指定 Anime 下的所有附件文件
   * 附件文件指的是未被关联到剧集的文件
   *
   * @param animeId
   * @returns 归类后的文件列表，每个 SimilarFiles 包含来自不同存储器的相同文件
   */
  async getAnimeAttachmentFiles(animeId: number): Promise<SimilarFiles[]> {
    const unlinkedFiles = await this.prisma.storageIndex.findMany({
      where: {
        animeId: animeId,
        removed: false,
        isDirectory: false,
        episodes: {
          none: {},
        },
      },
    });

    return this.groupSimilarFiles(unlinkedFiles);
  }

  /**
   * 获取指定 Anime 的 SimilarFiles
   *
   * @param animeId 要获取的 Anime 的 ID
   * @returns SimilarFiles 归类后的文件列表，每个 SimilarFiles 包含来自不同存储器的相同文件
   */
  async getAnimeFiles(animeId: number): Promise<SimilarFiles[]> {
    const anime = await this.prisma.anime.findUnique({
      where: { id: animeId },
      select: { nsfw: true },
    });

    if (!anime) return [];

    const files = await this.prisma.storageIndex.findMany({
      where: {
        animeId: animeId,
        removed: false,
        isDirectory: false,
        storage: anime.nsfw ? { noNSFW: false } : {}, // 如果动画 NSFW，过滤掉禁 NSFW 的存储器
      },
    });

    return this.groupSimilarFiles(files);
  }

  /**
   * 将文件整理为 SimilarFiles[]
   *
   * 本方法传入多个 StorageIndex，
   * 然后将 animeId、name、size 相同的文件视作相同文件，并在同一个 SimilarFiles 中返回
   * @param files 要归类的文件
   * @returns 归类后的文件列表，每个 SimilarFiles 包含被视为相同的文件
   */
  groupSimilarFiles(files: StorageIndex[]): SimilarFiles[] {
    const result: SimilarFiles[] = [];
    files.forEach((file) => {
      const id = this.getUniqueId(file);
      const similarFile = result.find((item) => item.uniqueId === id);

      if (similarFile) {
        similarFile.files.push(file);
      } else {
        result.push({
          uniqueId: id,
          animeId: file.animeId,
          fileName: file.name,
          size: file.size,
          files: [file],
        });
      }
    });

    return result;
  }

  /**
   * 根据文件ID获取其所属的SimilarFiles
   *
   * @param fileId 要查找的文件ID
   * @returns 包含该文件的SimilarFiles，如果未找到则返回null
   */
  async getSimilarFiles(fileId: number): Promise<SimilarFiles | null> {
    // 获取文件信息
    const file = await this.prisma.storageIndex.findUnique({
      where: { id: fileId },
    });

    if (!file || !file.animeId) {
      return null;
    }

    // 获取该动画的所有 SimilarFiles
    const similarFiles = await this.getAnimeFiles(file.animeId);

    // 查找包含该文件的 SimilarFiles
    const targetGroup = similarFiles.find((group) =>
      group.files.some((groupFile) => groupFile.id === fileId)
    );

    return targetGroup || null;
  }

  /**
   * 传入一个文件，将通过 animeId、name、size 返回一个唯一的十位 ID
   *
   * 被认为相似的文件，此方法将返回相同的结果
   */
  getUniqueId(storageIndex: StorageIndex) {
    return hash(
      objectHash([storageIndex.animeId, storageIndex.name, storageIndex.size])
    );
  }
}
