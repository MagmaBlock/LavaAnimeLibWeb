import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { AnimeEpisode, StorageIndex } from "@prisma/client";
import { App } from "~/server/services/app";
// import { UserService } from "~/server/services/user/service"; // 不再直接使用
import { getUserFromEvent } from "~/server/utils/auth"; // 导入新的认证函数
import { AnimeFileService } from "~/server/services/anime/file/service";
import { AnimeEpisodeFileLinker } from "~/server/services/anime/episode/file-linker";
import { SimilarFiles } from "~/server/services/anime/file/types/similar-files"; // 确保路径正确
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

const bodySchema = z.object({
  animeId: z.number(),
});

// 定义返回类型 (替代 TrpcPagesAnimeMainData)
interface AnimeMainData {
  episodes: {
    episode: AnimeEpisode;
    similarFilesIds: string[];
    recommendedSimilarFilesId: string | null;
    recommended: boolean;
  }[];
  similarFiles: SimilarFiles[];
  files: StorageIndex[];
}

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }
  const userId = user.id; // 从 user 对象中获取 userId

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parsedBody.error.flatten() },
    };
  }

  const { animeId } = parsedBody.data;

  try {
    const anime = await prisma.anime.findUnique({
      where: { id: animeId },
      select: { nsfw: true },
    });

    if (!anime) {
      return {
        success: false,
        message: "动画不存在",
        data: null,
      };
    }

    const animeFileService =
      App.instance.services.getService(AnimeFileService);

    const animeEpisodeFileLinker = new AnimeEpisodeFileLinker();
    await animeEpisodeFileLinker.linkAnimeFiles([animeId]);

    const episodes = await prisma.animeEpisode.findMany({
      where: { animeId },
      orderBy: [{ type: "asc" }, { episodeIndex: "asc" }],
    });

    const latestViewHistory = await prisma.animeViewHistory.findFirst({
      where: {
        animeId,
        userId, // 使用从 user 对象中获取的 userId
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
      let similarFiles = await animeFileService.getAnimeEpisodeFiles(
        episode.id,
      );

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

      let recommendedSimilarFilesId = null;
      if (videoGroups.length > 0) {
        if (latestViewHistory && latestViewHistory.episodeId === episode.id) {
          const lastPlayedFile = videoGroups.find((group) =>
            group.files.some((file) => file.id === latestViewHistory.fileId),
          );
          if (lastPlayedFile) {
            recommendedSimilarFilesId = lastPlayedFile.uniqueId;
          }
        }

        if (!recommendedSimilarFilesId) {
          recommendedSimilarFilesId = videoGroups[0].uniqueId;
        }
      }

      return {
        similarFilesIds: similarFiles.map((group) => group.uniqueId),
        recommendedSimilarFilesId,
        recommended: false,
      };
    }

    const episodesWithFileNames = await Promise.all(
      episodes.map(async (episode) => {
        return {
          episode,
          ...(await getEpisodeSimilarFiles(episode)),
        };
      }),
    );

    let lastWatchedIndex = -1;
    if (latestViewHistory) {
      lastWatchedIndex = episodesWithFileNames.findIndex(
        (e) => e.episode.id === latestViewHistory.episodeId,
      );
      const isCompleted = isVideoCompleted(
        latestViewHistory.currentTime,
        latestViewHistory.totalTime,
      );

      if (
        isCompleted &&
        lastWatchedIndex < episodesWithFileNames.length - 1
      ) {
        lastWatchedIndex++;
      }
    }

    if (lastWatchedIndex !== -1) {
      episodesWithFileNames[lastWatchedIndex].recommended = true;
    } else {
      if (episodesWithFileNames.length > 0) {
        episodesWithFileNames[0].recommended = true;
      }
    }

    const similarFilesData = await animeFileService.getAnimeFiles(animeId);
    const filesData = await prisma.storageIndex.findMany({
      where: { animeId, removed: false },
    });

    const responseData: AnimeMainData = {
      episodes: episodesWithFileNames,
      similarFiles: similarFilesData,
      files: filesData,
    };

    return {
      success: true,
      message: "获取动画主数据成功",
      data: responseData,
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/anime/get-main-data:`, error);
    if (error instanceof TRPCError) { // TRPCError 可能不再适用，但保留以防万一
      return {
        success: false,
        message: error.message,
        data: { code: error.code },
      };
    }
    return {
      success: false,
      message: "获取动画主数据失败",
      data: null,
    };
  }
});