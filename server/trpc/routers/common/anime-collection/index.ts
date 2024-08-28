import { z } from "zod";
import { AnimeCollectionService } from "~/server/services/anime/collection/service";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
import { App } from "~/server/services/app";
import { protectedProcedure, router } from "~/server/trpc/trpc";

export const animeCollectionRouter = router({
  // 获取用户追番状态
  getUserAnimeCollectionStatus: protectedProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { animeId } = input;
      const userId = ctx.user.id;

      const animeCollectionService = App.instance.services.getService(
        AnimeCollectionService
      );
      return await animeCollectionService.getUserAnimeCollectionStatus(
        userId,
        animeId
      );
    }),

  // 修改用户追番状态
  toggleUserAnimeCollectionStatus: protectedProcedure
    .input(
      z.object({
        animeId: z.number(),
        status: z.enum(["Plan", "Watching", "Finished"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { animeId, status } = input;
      const userId = ctx.user.id;

      const animeCollectionService = App.instance.services.getService(
        AnimeCollectionService
      );
      await animeCollectionService.toggleUserAnimeCollectionStatus(
        userId,
        animeId,
        status
      );
    }),
  // 获取用户追番列表
  getUserAnimeCollections: protectedProcedure
    .input(
      z.object({
        status: z.enum(["Plan", "Watching", "Finished"]),
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, page, pageSize } = input;
      const userId = ctx.user.id;

      const animePictureService =
        App.instance.services.getService(AnimePictureSerivce);

      const skip = (page - 1) * pageSize;

      const collections = await App.instance.prisma.animeCollection.findMany({
        where: {
          userId,
          status: status,
        },
        include: {
          anime: {
            include: {
              userViews: true,
            },
          },
        },
        skip,
        take: pageSize,
      });

      const totalCount = await App.instance.prisma.animeCollection.count({
        where: {
          userId,
          status: status,
        },
      });

      const totalPages = Math.ceil(totalCount / pageSize);

      const result = await Promise.all(
        collections.map(async (collection) => {
          return {
            collection: {
              ...collection,
              anime: undefined,
            },
            anime: {
              id: collection.anime.id,
              name: collection.anime.name,
              bdrip: collection.anime.bdrip,
              nsfw: collection.anime.nsfw,
              platform: collection.anime.platform,
              date: collection.anime.date,
              releaseYear: collection.anime.releaseYear,
              releaseSeason: collection.anime.releaseSeason,
              region: collection.anime.region,
              poster: await animePictureService.getAnimePoster(
                collection.anime.id,
                true
              ),
              views: collection.anime.userViews.length,
            },
          };
        })
      );

      return {
        totalPages,
        items: result,
      };
    }),

  getUserAnimeCollectionCounts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const counts = await App.instance.prisma.animeCollection.groupBy({
      by: ["status"],
      where: {
        userId,
      },
      _count: {
        status: true,
      },
    });

    const result = {
      Plan: 0,
      Watching: 0,
      Finished: 0,
    };

    counts.forEach((count) => {
      result[count.status] = count._count.status;
    });

    return result;
  }),
});
