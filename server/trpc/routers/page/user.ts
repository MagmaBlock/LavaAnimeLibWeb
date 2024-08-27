import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { protectedProcedure, router } from "../../trpc";
import { historyRouter } from "./user/history";

export const userRouter = router({
  infoCard: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    let avatarUrl = user.avatarUrl;
    if (!avatarUrl && user.avatarFileId) {
      const storageIndex = await App.instance.prisma.storageIndex.findUnique({
        where: {
          id: user.avatarFileId,
        },
      });
      if (storageIndex) {
        avatarUrl = await App.instance.services
          .getService(StorageService)
          .getFileTempUrl(storageIndex);
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: avatarUrl,
    };
  }),

  recentHistory: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const storageService = App.instance.services.getService(StorageService);

    const recentHistory = await App.instance.prisma.animeViewHistory.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
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
      },
    });

    return Promise.all(
      recentHistory.map(async (history) => {
        const smallPosterOrPoster =
          history.anime.posters.find(
            (poster) => poster.type === "SmallPoster"
          ) ?? history.anime.posters.find((poster) => poster.type === "Poster");

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
          animeId: history.animeId,
          name: history.anime.name ?? history.anime.originalName,
          episode: history.episode,
          currentTime: history.currentTime,
          totalTime: history.totalTime,
          watchMethod: history.watchMethod,
          updatedAt: history.updatedAt,
          imageUrl: posterUrl,
        };
      })
    );
  }),

  history: historyRouter,
});
