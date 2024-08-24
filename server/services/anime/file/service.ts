import type { StorageIndex } from "@prisma/client";
import { App } from "../../app";

/**
 * 本类主要管理动画的文件服务，减轻前端在处理动画文件时的压力
 */
export class AnimeFileService {
  private readonly prisma = App.instance.prisma;

  /**
   * 获取指定 Anime 下所有未关联到 AnimeEpisode 的文件的 MirrorGroup
   *
   * 本方法返回一个二维数组，每个子数组包含来自不同存储器的相同文件
   * @param animeId 要获取的 Anime 的 ID
   * @returns 归类后的文件列表，每个子数组包含来自不同存储器的相同文件
   */
  async getAnimeMirrorGroupsNoEpisode(
    animeId: number
  ): Promise<StorageIndex[][]> {
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
   * 获取指定 AnimeEpisode 的 MirrorGroup
   *
   * 本方法返回一个二维数组，每个子数组包含来自不同存储器的相同文件
   * @param animeEpisodeId 要获取的 AnimeEpisode 的 ID
   * @returns 归类后的文件列表，每个子数组包含来自不同存储器的相同文件
   */
  async getAnimeEpisodeMirrorGroups(
    animeEpisodeId: number
  ): Promise<StorageIndex[][]> {
    // 查询指定的 AnimeEpisode，同时获取相关联的文件和动画信息
    // 1. 获取 AnimeEpisode 本身的信息
    // 2. 包含与该 AnimeEpisode 直接关联的文件（files）
    // 3. 包含与该 AnimeEpisode 直接关联的 Anime 信息
    // 4. 获取该 Anime 下所有未被删除、非目录、且未关联到任何 AnimeEpisode 的文件
    // （因为 mirrorGroup 中的部分文件可能未被及时关联到集数，这时我们也将这些文件带上）
    // 这样可以在一次查询中获取所有需要的数据，避免多次数据库查询
    const animeEpisode = await this.prisma.animeEpisode.findFirst({
      where: {
        id: animeEpisodeId,
      },
      include: {
        files: true,
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

    // 获取已关联到该剧集的文件ID集合
    const linkedFileIds = new Set(animeEpisode.files.map((file) => file.id));

    // 合并已关联和未关联的文件
    const allFiles = [...animeEpisode.files, ...animeEpisode.anime.files];

    // 使用优化后的 groupSimilarFiles 方法
    const groupedResult = this.groupSimilarFiles(allFiles);

    // 过滤掉全部未关联的组
    return groupedResult.filter((group) =>
      group.some((file) => linkedFileIds.has(file.id))
    );
  }

  /**
   * 获取指定 Anime 的 MirrorGroup
   *
   * 本方法返回一个二维数组，每个子数组包含来自不同存储器的相同文件
   * @param animeId 要获取的 Anime 的 ID
   * @returns 归类后的文件列表，每个子数组包含来自不同存储器的相同文件
   */
  async getAnimeMirrorGroups(animeId: number): Promise<StorageIndex[][]> {
    const files = await this.prisma.storageIndex.findMany({
      where: {
        animeId: animeId,
        removed: false,
        isDirectory: false,
      },
    });

    return this.groupSimilarFiles(files);
  }

  /**
   * 将来自不同存储器的相同文件归纳返回
   *
   * 本方法传入多个 StorageIndex，
   * 然后将同一个 Anime 下的同名、同大小的文件视作相同文件，
   * 并在同一个数组中返回
   * @param files 要归类的文件列表
   * @returns 归类后的文件列表，每个子数组包含被视为相同的文件
   */
  groupSimilarFiles(files: StorageIndex[]): StorageIndex[][] {
    // 使用 Map 代替对象，提高性能
    const groupedFiles = new Map<string, StorageIndex[]>();

    for (const file of files) {
      const key = `${file.animeId}_${file.name}_${file.size}`;
      if (!groupedFiles.has(key)) {
        groupedFiles.set(key, []);
      }
      groupedFiles.get(key)!.push(file);
    }

    // 直接返回 Map 的值，避免额外的 Object.values 调用
    return Array.from(groupedFiles.values());
  }
}
