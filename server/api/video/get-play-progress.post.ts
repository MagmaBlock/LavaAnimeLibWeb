import { z } from "zod";
import { App } from "~/server/services/app";
import { getUserFromEvent } from "~/server/utils/auth";
import { prisma } from "~/server/src/context/prisma";

// 定义判断视频是否已看完的常量 (与 anime.ts 中一致)
const COMPLETION_THRESHOLD = 0.95;

// 判断视频是否已看完的函数 (与 anime.ts 中一致)
const isVideoCompleted = (
  currentTime: number | null,
  totalTime: number | null,
): boolean => {
  if (!currentTime || !totalTime) return false;
  return currentTime / totalTime >= COMPLETION_THRESHOLD;
};

const bodySchema = z.object({
  animeId: z.number(),
  episodeId: z.number().optional().nullish(),
  fileId: z.number(),
});

interface VideoPlayProgress {
  currentTime: number;
  foundBy: "file" | "episode";
  completed: boolean;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; message: string; data: VideoPlayProgress | null | { errors?: any } }> => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }
  const userId = user.id;

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parsedBody.error.flatten() },
    };
  }

  const { animeId, episodeId, fileId } = parsedBody.data;

  try {
    const file = await prisma.storageIndex.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return {
        success: true, // 或 false，取决于业务需求，原逻辑返回 null
        message: "文件不存在，无法获取播放进度",
        data: null,
      };
    }

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

    if (uniqueHistory && uniqueHistory.currentTime !== null) { // 确保 currentTime 不是 null
      const completed = isVideoCompleted(
        uniqueHistory.currentTime,
        uniqueHistory.totalTime,
      );
      return {
        success: true,
        message: "获取播放进度成功 (按文件)",
        data: {
          currentTime: uniqueHistory.currentTime,
          foundBy: "file",
          completed,
        },
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

      if (episodeRecord && episodeRecord.currentTime !== null) { // 确保 currentTime 不是 null
        const completed = isVideoCompleted(
          episodeRecord.currentTime,
          episodeRecord.totalTime,
        );
        return {
          success: true,
          message: "获取播放进度成功 (按剧集)",
          data: {
            currentTime: episodeRecord.currentTime,
            foundBy: "episode",
            completed,
          },
        };
      }
    }

    // 如果都没找到，返回 null
    return {
      success: true,
      message: "未找到播放进度记录",
      data: null,
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/video/get-play-progress:`, error);
    return {
      success: false,
      message: "获取播放进度失败",
      data: null,
    };
  }
});