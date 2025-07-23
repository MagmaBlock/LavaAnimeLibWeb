import { AnimeEpisode, StorageIndex } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { parseFileName } from "anime-name-tool";
import { z } from "zod";
import { AnimeEpisodeFileLinker } from "~/server/services/anime/episode/file-linker";
import { AnimeFileService } from "~/server/services/anime/file/service";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { protectedProcedure, router } from "../../trpc";
import { AnimeService } from "~/server/services/anime/service";
import moment from "moment";
import { SimilarFiles } from "~/server/services/anime/file/types/similar-files";
import { prisma } from "~/server/src/context/prisma";

// 定义判断视频是否已看完的常量
const COMPLETION_THRESHOLD = 0.95;

// 判断视频是否已看完的函数
const isVideoCompleted = (
  currentTime: number | null,
  totalTime: number | null,
): boolean => {
  if (!currentTime || !totalTime) return false;
  return currentTime / totalTime >= COMPLETION_THRESHOLD;
};

export const animeRouter = router({
  // 获取动画的资料信息
  getAnimeInfo: protectedProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input, ctx }) => {
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
        throw new TRPCError({ code: "NOT_FOUND", message: "动画不存在" });
      }

      // 获取追番数量
      const followCount = await prisma.animeCollection.count({
        where: { animeId },
      });

      // 获取观看数量
      const viewCount = await prisma.animeViewHistory.count({
        where: { animeId },
      });

      const animePictureService =
        App.instance.services.getService(AnimePictureSerivce);

      const posterUrl = await animePictureService.getAnimePoster(animeId, true);

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
          (episode) => episode.type === "Normal",
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
  getAnimeMainData: protectedProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input, ctx }): Promise<TrpcPagesAnimeMainData> => {
      const { animeId } = input;
      const userId = ctx.user.id;

      // 获取当前动画的 nsfw 状态，以及判断动画是否存在
      const anime = await prisma.anime.findUnique({
        where: { id: animeId },
        select: { nsfw: true },
      });

      if (!anime) {
        throw new TRPCError({ code: "NOT_FOUND", message: "动画不存在" });
      }

      // 获取所需的服务实例
      const animeFileService =
        App.instance.services.getService(AnimeFileService);

      // 将番剧的文件与剧集进行自动关联
      const animeEpisodeFileLinker = new AnimeEpisodeFileLinker();
      await animeEpisodeFileLinker.linkAnimeFiles([animeId]);

      // 从数据库获取所有剧集
      const episodes = await prisma.animeEpisode.findMany({
        where: { animeId },
        orderBy: [{ type: "asc" }, { episodeIndex: "asc" }],
      });

      // 获取用户最近观看的剧集
      const latestViewHistory = await prisma.animeViewHistory.findFirst({
        where: {
          animeId,
          userId,
          episodeId: { not: null },
        },
        orderBy: { updatedAt: "desc" },
        select: {
          episodeId: true,
          fileId: true,
          currentTime: true,
          totalTime: true,
        },
      });

      async function getEpisodeSimilarFiles(episode: AnimeEpisode) {
        // 获取剧集的 SimilarFiles
        let similarFiles = await animeFileService.getAnimeEpisodeFiles(
          episode.id,
        );

        // 筛选并排序视频组
        const videoGroups = similarFiles
          .filter((group) => group.files.some((file) => file.type === "Video"))
          .sort((a, b) => {
            const aIsMkv = a.files[0].name.toLowerCase().endsWith(".mkv");
            const bIsMkv = b.files[0].name.toLowerCase().endsWith(".mkv");
            if (aIsMkv !== bIsMkv) {
              return aIsMkv ? 1 : -1;
            }
            return (b.files[0].size ?? 0) - (a.files[0].size ?? 0);
          });

        // 处理推荐的镜像组
        let recommendedSimilarFilesId = null;
        if (videoGroups.length > 0) {
          if (latestViewHistory && latestViewHistory.episodeId === episode.id) {
            // 如果用户之前观看过这个剧集，优先推荐最后一次播放的文件
            const lastPlayedFile = videoGroups.find((group) =>
              group.files.some((file) => file.id === latestViewHistory.fileId),
            );
            if (lastPlayedFile) {
              recommendedSimilarFilesId = lastPlayedFile.uniqueId;
            }
          }

          // 如果没有找到最后播放的文件，或者用户没有观看记录，则使用最佳视频组
          if (!recommendedSimilarFilesId) {
            recommendedSimilarFilesId = videoGroups[0].uniqueId;
          }
        }

        // 返回处理后的剧集信息
        return {
          similarFilesIds: similarFiles.map((group) => group.uniqueId),
          recommendedSimilarFilesId,
          recommended: false, // 初始化为 false，稍后会更新
        };
      }

      // 处理每个剧集的镜像组信息
      const episodesWithFileNames = await Promise.all(
        episodes.map(async (episode) => {
          return {
            episode,
            ...(await getEpisodeSimilarFiles(episode)),
          };
        }),
      );

      // 找到最近观看的剧集，并判断是否已看完
      let lastWatchedIndex = -1;
      if (latestViewHistory) {
        lastWatchedIndex = episodesWithFileNames.findIndex(
          (e) => e.episode.id === latestViewHistory.episodeId,
        );
        const isCompleted = isVideoCompleted(
          latestViewHistory.currentTime,
          latestViewHistory.totalTime,
        );

        // 如果已看完，推荐下一集（如果存在）
        if (
          isCompleted &&
          lastWatchedIndex < episodesWithFileNames.length - 1
        ) {
          lastWatchedIndex++;
        }
      }

      // 如果找到了最近观看的剧集，将其标记为推荐
      if (lastWatchedIndex !== -1) {
        episodesWithFileNames[lastWatchedIndex].recommended = true;
      } else {
        // 如果没有观看记录，将第一个剧集标记为推荐
        if (episodesWithFileNames.length > 0) {
          episodesWithFileNames[0].recommended = true;
        }
      }

      // 处理所有唯一文件 (MirrorGroup) 列表
      const similarFiles = await animeFileService.getAnimeFiles(animeId);

      // 获取所有文件列表
      // TODO: NSFW filter
      const files = await prisma.storageIndex.findMany({
        where: { animeId, removed: false },
      });

      // 返回最终结果
      return {
        episodes: episodesWithFileNames,
        similarFiles,
        files,
      };
    }),

  // 获取文件的临时下载链接
  getFileTempUrls: protectedProcedure
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
          }),
        );

        return result;
      },
    ),

  // 获取 Storage 信息
  getStorageInfomations: protectedProcedure.query(async () => {
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

  // 记录用户观看历史
  recordUserViewHistory: protectedProcedure
    .input(
      z.object({
        animeId: z.number(),
        episodeId: z.number().optional().nullish(),
        fileId: z.number(),
        currentTime: z.number().optional(),
        totalTime: z.number().optional(),
        userIP: z.string().optional(),
        watchMethod: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        animeId,
        episodeId,
        fileId,
        currentTime,
        totalTime,
        userIP,
        watchMethod,
      } = input;
      const userId = ctx.user.id;
      const file = await prisma.storageIndex.findUnique({
        where: { id: fileId },
      });
      if (!file) return;

      await prisma.animeViewHistory.upsert({
        where: {
          userId_animeId_fileName: {
            userId,
            animeId,
            fileName: file.name,
          },
        },
        update: {
          fileId,
          episodeId,
          currentTime,
          totalTime,
          userIP,
          watchMethod,
          removed: false,
        },
        create: {
          userId,
          animeId,
          fileName: file.name,
          episodeId,
          fileId,
          currentTime,
          totalTime,
          userIP,
          watchMethod,
        },
      });
    }),

  // 获取视频播放进度
  getVideoPlayProgress: protectedProcedure
    .input(
      z.object({
        animeId: z.number(),
        episodeId: z.number().optional().nullish(),
        fileId: z.number(),
      }),
    )
    .query(
      async ({
        input,
        ctx,
      }): Promise<{
        currentTime: number;
        foundBy: "file" | "episode";
        completed: boolean;
      } | null> => {
        const { animeId, episodeId, fileId } = input;
        const userId = ctx.user.id;

        const file = await prisma.storageIndex.findUnique({
          where: { id: fileId },
        });

        if (!file) return null;

        // 1. 尝试通过 userId, animeId, fileName 查找
        const uniqueHistory = await prisma.animeViewHistory.findUnique({
          where: {
            userId_animeId_fileName: {
              userId,
              animeId,
              fileName: file.name,
            },
          },
          select: {
            currentTime: true,
            totalTime: true,
          },
        });

        if (uniqueHistory && uniqueHistory.currentTime) {
          const completed = isVideoCompleted(
            uniqueHistory.currentTime,
            uniqueHistory.totalTime,
          );
          return {
            currentTime: uniqueHistory.currentTime,
            foundBy: "file",
            completed,
          };
        }

        // 2. 如果还没找到，且提供了 episodeId，则查找同一集的最后观看记录
        if (episodeId) {
          const episodeRecord = await prisma.animeViewHistory.findFirst({
            where: {
              userId,
              animeId,
              episodeId,
            },
            select: {
              currentTime: true,
              totalTime: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
          });

          if (episodeRecord && episodeRecord.currentTime) {
            const completed = isVideoCompleted(
              episodeRecord.currentTime,
              episodeRecord.totalTime,
            );
            return {
              currentTime: episodeRecord.currentTime,
              foundBy: "episode",
              completed,
            };
          }
        }

        // 如果都没找到，返回 null
        return null;
      },
    ),

  // 让服务端判断动画信息是否需要更新。此接口返回信息是否已被更新，如果有，前端需要再次刷新 getAnimeInfo 和 getAnimeMainData
  tryUpdateAnimeInfo: protectedProcedure
    .input(z.object({ animeId: z.number() }))
    .mutation(async ({ input }) => {
      const { animeId } = input;
      const animeService = App.instance.services.getService(AnimeService);
      const isUpdated = await animeService.updateAnimeInfoBefore(
        animeId,
        moment().subtract(3, "days").toDate(),
      );
      return { isUpdated };
    }),
});

// 定义返回类型
export type TrpcPagesAnimeMainData = {
  episodes: {
    episode: AnimeEpisode;
    // 此剧集的所有 SimilarFiles, 前端应该根据这些 ID 去下面找
    similarFilesIds: string[];
    // 此集数下，推荐前端自动选择的文件
    recommendedSimilarFilesId: string | null;
    // 是否推荐前端自动选择
    recommended: boolean;
  }[];
  // 本动画所有唯一文件 (SimilarFiles) 列表
  similarFiles: SimilarFiles[];
  // 本动画所有文件列表
  files: StorageIndex[];
};
