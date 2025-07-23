import { z } from "zod";
import { App } from "~/server/services/app";
import { publicProcedure, router } from "~/server/trpc/trpc";
import { prisma } from "~/server/src/context/prisma";

export const adminAnimeManageRouter = router({
  // 获取 Anime 列表
  getAnimeList: publicProcedure.query(async () => {
    const animes = await prisma.anime.findMany({
      select: {
        id: true,
        name: true,
        originalName: true,
      },
    });

    return animes;
  }),

  // 获取单个 Anime 详细信息
  getAnime: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const anime = await prisma.anime.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          originalName: true,
          summary: true,
          bdrip: true,
          nsfw: true,
          platform: true,
          date: true,
          releaseYear: true,
          releaseSeason: true,
          region: true,
        },
      });

      if (!anime) {
        throw new Error("Anime not found");
      }

      return anime;
    }),

  // 新建或更新动画
  upsertAnime: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        originalName: z.string().optional(),
        summary: z.string().optional(),
        bdrip: z.boolean().default(false),
        nsfw: z.boolean().default(false),
        platform: z.enum(["TV", "Web", "OVA", "Movie", "Other"]).optional(),
        date: z.date().optional(),
        releaseYear: z.number().int().optional(),
        releaseSeason: z.string().optional(),
        region: z
          .enum(["Japan", "China", "Korea", "Europe", "America", "Other"])
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...animeData } = input;

      const upsertedAnime = await prisma.anime.upsert({
        where: { id },
        update: animeData,
        create: animeData,
      });

      return upsertedAnime;
    }),
});
