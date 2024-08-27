import { z } from "zod";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { protectedProcedure, router } from "../../../trpc";
import moment from "moment";
import { EpisodeType } from "@prisma/client";

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

export const historyRouter = router({
  getDetailedHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(100),
      })
    )
    .query(async ({ ctx, input }): Promise<HistoryResponse> => {
      const user = ctx.user;
      const storageService = App.instance.services.getService(StorageService);

      const skip = (input.page - 1) * input.pageSize;

      const detailedHistory =
        await App.instance.prisma.animeViewHistory.findMany({
          where: {
            userId: user.id,
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
        },
      });

      const groupedHistory = await Promise.all(
        detailedHistory.map(async (history) => {
          const date = moment(history.updatedAt).format("YYYY-MM-DD");

          const smallPosterOrPoster =
            history.anime.posters.find(
              (poster) => poster.type === "SmallPoster"
            ) ??
            history.anime.posters.find((poster) => poster.type === "Poster");

          let posterUrl: string | null = smallPosterOrPoster?.url ?? null;
          if (!posterUrl && smallPosterOrPoster?.file) {
            posterUrl = await storageService.getFileTempUrl(
              smallPosterOrPoster.file
            );
          }

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
        })
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
});
