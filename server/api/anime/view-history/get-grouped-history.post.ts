import { z } from "zod";
import { EpisodeType } from "@prisma/client";
import moment from "moment";
import { App } from "~/server/services/app";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
import { getUserFromEvent } from "~/server/utils/auth";

// 从 tRPC 文件迁移的接口定义
interface HistoryItem {
  id: string;
  animeId: number;
  name: string;
  episode: {
    id: number;
    type: EpisodeType;
    episodeDisplay: number;
  } | null;
  currentTime: number | null;
  totalTime: number | null;
  watchMethod: string | null;
  updatedAt: Date;
  imageUrl: string | null;
  fileName: string | null;
  userIP: string | null;
}

interface GroupedHistory {
  [date: string]: HistoryItem[];
}

const bodySchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(100),
});

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    return {
      success: false,
      message: "未登录",
      data: null,
    };
  }

  const body = bodySchema.safeParse(await readBody(event));

  if (body.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: null,
    };
  }

  const { page, pageSize } = body.data;

  const animePictureService =
    App.instance.services.getService(AnimePictureSerivce);

  const skip = (page - 1) * pageSize;

  const detailedHistory =
    await App.instance.prisma.animeViewHistory.findMany({
      where: {
        userId: user.id,
        removed: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        anime: {
          include: {
            posters: {
              include: {
                file: true,
              },
            },
          },
        },
        episode: true,
        file: true,
      },
    });

  const totalCount = await App.instance.prisma.animeViewHistory.count({
    where: {
      userId: user.id,
      removed: false,
    },
  });

  const groupedHistory = await Promise.all(
    detailedHistory.map(async (history) => {
      const date = moment(history.updatedAt).format("YYYY-MM-DD");

      const posterUrl = await animePictureService.getAnimePoster(
        history.animeId,
        true,
      );

      return {
        date,
        historyItem: {
          id: history.id,
          animeId: history.animeId,
          name: history.anime.name ?? history.anime.originalName,
          episode: history.episode
            ? {
                id: history.episode.id,
                type: history.episode.type,
                episodeDisplay: history.episode.episodeDisplay,
              }
            : null,
          currentTime: history.currentTime,
          totalTime: history.totalTime,
          watchMethod: history.watchMethod,
          updatedAt: history.updatedAt,
          imageUrl: posterUrl,
          fileName: history.fileName,
          userIP: history.userIP,
        } as HistoryItem,
      };
    }),
  );

  const groupedHistoryObject = groupedHistory.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item.historyItem);
    return acc;
  }, {} as GroupedHistory);

  return {
    success: true,
    message: "获取成功",
    data: {
      history: groupedHistoryObject,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
    },
  };
});