import { EpisodeType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { z } from "zod";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
import { App } from "~/server/services/app";
import { protectedProcedure, router } from "../../../trpc";

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

interface HistoryResponse {
  history: GroupedHistory;
  totalCount: number;
  pageCount: number;
}

export const animeViewHistoryRouter = router({
  getGroupedHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(100),
      }),
    )
    .query(async ({ ctx, input }): Promise<HistoryResponse> => {
      const user = ctx.user;
      const animePictureService =
        App.instance.services.getService(AnimePictureSerivce);

      const skip = (input.page - 1) * input.pageSize;

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
          take: input.pageSize,
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
        history: groupedHistoryObject,
        totalCount,
        pageCount: Math.ceil(totalCount / input.pageSize),
      };
    }),

  removeHistory: protectedProcedure
    .input(z.object({ historyId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { historyId } = input;

      const updatedHistory =
        await App.instance.prisma.animeViewHistory.updateMany({
          where: {
            id: historyId,
            userId: user.id,
          },
          data: {
            removed: true,
          },
        });

      if (updatedHistory.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "未找到指定的观看历史记录",
        });
      }

      return { success: true, message: "观看历史记录已成功删除" };
    }),
});
