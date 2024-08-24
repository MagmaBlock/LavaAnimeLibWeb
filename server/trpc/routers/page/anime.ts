import { AnimeEpisode, StorageIndex } from "@prisma/client";
import { parseFileName } from "anime-name-tool";
import { z } from "zod";
import { AnimeFileService } from "~/server/services/anime/file/service";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { publicProcedure, router } from "../../trpc";

const prisma = App.instance.prisma;

export const animeRouter = router({
  getAnimeInfo: publicProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }) => {
      const { animeId } = input;

      const animeInfo = await prisma.anime.findUnique({
        where: { id: animeId },
        include: {
          tags: true,
          ratings: true,
          posters: {
            include: {
              file: true,
            },
          },
          sites: true,
          episodes: true,
        },
      });

      if (!animeInfo) {
        throw new Error("动画不存在");
      }

      // 获取追番数量
      const followCount = await prisma.animeCollection.count({
        where: { animeId },
      });

      // 获取观看数量
      const viewCount = await prisma.animeViewHistory.count({
        where: { animeId },
      });

      const storageService = App.instance.services.getService(StorageService);

      const smallPosterOrPoster =
        animeInfo.posters.find((poster) => poster.type === "SmallPoster") ??
        animeInfo.posters.find((poster) => poster.type === "Poster");

      let posterUrl = smallPosterOrPoster?.url;
      if (!posterUrl && smallPosterOrPoster?.file) {
        try {
          posterUrl = await storageService.getFileTempUrl(
            smallPosterOrPoster.file
          );
        } catch {
          posterUrl = null;
        }
      }

      return {
        id: animeInfo.id,
        title: animeInfo.name,
        originalTitle: animeInfo.originalName,
        summary: animeInfo.summary,
        bdrip: animeInfo.bdrip,
        nsfw: animeInfo.nsfw,
        platform: animeInfo.platform,
        releaseDate: animeInfo.date,
        totalEpisodes: animeInfo.episodes.filter(
          (episode) => episode.type === "Normal"
        ).length,
        tags: animeInfo.tags,
        ratings: animeInfo.ratings,
        posterUrl: posterUrl,
        sites: animeInfo.sites,
        followCount,
        viewCount,
      };
    }),

  // 获取动画的所有剧集信息
  getAnimeMainData: publicProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }): Promise<TrpcPageAnimeMainData> => {
      const { animeId } = input;

      // 获取所需的服务实例
      const animeFileService =
        App.instance.services.getService(AnimeFileService);

      // 获取当前动画的 nsfw 状态
      const anime = await prisma.anime.findUnique({
        where: { id: animeId },
        select: { nsfw: true },
      });

      if (!anime) {
        throw new Error("动画不存在");
      }

      // 获取所有 noNSFW 为 true 的存储
      const noNSFWStorages = await prisma.storage.findMany({
        where: { noNSFW: true },
        select: { id: true },
      });
      const noNSFWStorageIds = noNSFWStorages.map((storage) => storage.id);

      // 从数据库获取所有剧集
      const episodes = await prisma.animeEpisode.findMany({
        where: { animeId },
        orderBy: [{ type: "asc" }, { episodeIndex: "asc" }],
      });

      // 处理每个剧集的镜像组信息
      const episodesWithMirrorGroups = await Promise.all(
        episodes.map(async (episode, index) => {
          // 获取剧集的镜像组
          let mirrorGroups = await animeFileService.getAnimeEpisodeMirrorGroups(
            episode.id
          );

          // 如果动画是 nsfw，过滤掉 noNSFW 存储的文件
          if (anime.nsfw) {
            mirrorGroups = mirrorGroups
              .map((group) =>
                group.filter(
                  (file) => !noNSFWStorageIds.includes(file.storageId)
                )
              )
              .filter((group) => group.length > 0);
          }

          // 筛选并排序视频组
          const videoGroups = mirrorGroups
            .filter((group) => group.some((file) => file.type === "Video"))
            .sort((a, b) => {
              const aIsMkv = a[0].name.toLowerCase().endsWith(".mkv");
              const bIsMkv = b[0].name.toLowerCase().endsWith(".mkv");
              if (aIsMkv !== bIsMkv) {
                return aIsMkv ? 1 : -1;
              }
              return (b[0].size ?? 0) - (a[0].size ?? 0);
            });

          // 处理推荐的镜像组
          let recommendedMirrorGroupName = null;
          if (videoGroups.length > 0) {
            const bestVideoGroup = videoGroups[0];
            recommendedMirrorGroupName = bestVideoGroup[0].name;
          }

          // 返回处理后的剧集信息
          return {
            episode,
            mirrorGroupNames: mirrorGroups.map((group) => group[0].name),
            recommendedMirrorGroupName,
            recommended: index === 0, // 只推荐第一个剧集
          };
        })
      );

      // 处理所有唯一文件 (MirrorGroup) 列表
      const allMirrorGroups = await animeFileService.getAnimeMirrorGroups(
        animeId
      );
      const mirrorGroups = allMirrorGroups.map((group) => ({
        fileName: group[0].name,
        fileIds: group.map((file) => file.id),
        availableStorageIds: Array.from(
          new Set(group.map((file) => file.storageId))
        ).filter(
          (storageId) => !anime.nsfw || !noNSFWStorageIds.includes(storageId)
        ),
        parseResult: parseFileName(group[0].name),
      }));

      // 获取所有文件列表
      const files = await prisma.storageIndex.findMany({
        where: { animeId },
      });

      // 返回最终结果
      return {
        episodes: episodesWithMirrorGroups,
        mirrorGroups,
        files,
      };
    }),

  // 获取文件的临时下载链接
  getFileTempUrls: publicProcedure
    .input(z.object({ fileIds: z.array(z.number()) }))
    .query(
      async ({
        input,
      }): Promise<{ fileId: number; tempUrl: string | null }[]> => {
        const { fileIds } = input;
        const storageService = App.instance.services.getService(StorageService);

        const files = await prisma.storageIndex.findMany({
          where: { id: { in: fileIds } },
          include: { anime: { select: { nsfw: true } } },
        });

        const noNSFWStorages = await prisma.storage.findMany({
          where: { noNSFW: true },
          select: { id: true },
        });
        const noNSFWStorageIds = noNSFWStorages.map((storage) => storage.id);

        const result = await Promise.all(
          fileIds.map(async (fileId) => {
            const file = files.find((f) => f.id === fileId);
            if (!file) return { fileId, tempUrl: null };

            // 如果文件所属的动画是 nsfw，且存储在 noNSFW 的存储中，则不返回链接
            if (file.anime?.nsfw && noNSFWStorageIds.includes(file.storageId)) {
              return { fileId, tempUrl: null };
            }

            try {
              const tempUrl = await storageService.getFileTempUrl(file);
              return { fileId, tempUrl };
            } catch (error) {
              console.error(`获取文件 ${fileId} 的临时下载链接失败:`, error);
              return { fileId, tempUrl: null };
            }
          })
        );

        return result;
      }
    ),

  // 获取 Storage 信息
  getStorageInfomations: publicProcedure.query(async () => {
    const storages = await prisma.storage.findMany();
    return storages.map((storage) => ({
      id: storage.id,
      name: storage.name,
      description: storage.description,
      type: storage.type,
      noNSFW: storage.noNSFW,
      noDownload: storage.noDownload,
      bindScraper: storage.bindScraper,
    }));
  }),
});

// 定义返回类型
export type TrpcPageAnimeMainData = {
  episodes: {
    episode: AnimeEpisode;
    // 剧集的所有 MirrorGroup
    // 正常依据视频的质量、字幕组、以及更容易在浏览器中播放来排序
    mirrorGroupNames: string[]; // 这里的数字是 MirrorGroup 的 ID
    // 推荐的 MirrorGroup
    recommendedMirrorGroupName: string | null;
    // 是否推荐前端自动选择
    recommended: boolean;
  }[];
  // 本动画所有唯一文件 (MirrorGroup) 列表
  mirrorGroups: {
    // 文件名, 由于 mirrorGroup 是虚拟的，所以这里用文件名来标识
    fileName: string;
    // 本 MirrorGroup 包含的文件
    fileIds: number[]; // 这里的数字是 StorageIndex 的 ID
    // 本 MirrorGroup 可用的 Storage 列表
    availableStorageIds: string[];
    // 文件名解析结果
    parseResult: any;
  }[];
  // 本动画所有文件列表
  files: StorageIndex[];
};
