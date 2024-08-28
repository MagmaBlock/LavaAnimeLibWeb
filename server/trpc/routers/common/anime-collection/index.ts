import { z } from "zod";
import { AnimeCollectionService } from "~/server/services/anime/collection/service";
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
      })
    )
    .query(async ({ input, ctx }) => {
      const { status } = input;
      const userId = ctx.user.id;

      const animeCollectionService = App.instance.services.getService(
        AnimeCollectionService
      );
      const collections = await animeCollectionService.getUserAnimeCollections(
        userId,
        status
      );

      return collections;
    }),
});
