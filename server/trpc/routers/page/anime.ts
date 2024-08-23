import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { parseFileName } from "anime-name-tool";

const prisma = App.instance.prisma;

export const animeRouter = router({
  getAnimeInfo: publicProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }) => {
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
        throw new Error("动画不存在");
      }

      // 获取追番数量
      const followCount = await prisma.animeCollection.count({
        where: { animeId },
      });

      // 获取观看数量
      const viewCount = await prisma.animeViewHistory.count({
        where: { animeId },
      });

      const storageService = App.instance.services.getService(StorageService);

      const smallPosterOrPoster =
        animeInfo.posters.find((poster) => poster.type === "SmallPoster") ??
        animeInfo.posters.find((poster) => poster.type === "Poster");

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
        id: animeInfo.id,
        title: animeInfo.name,
        originalTitle: animeInfo.originalName,
        summary: animeInfo.summary,
        bdrip: animeInfo.bdrip,
        nsfw: animeInfo.nsfw,
        platform: animeInfo.platform,
        releaseDate: animeInfo.date,
        totalEpisodes: animeInfo.episodes.filter(
          (episode) => episode.type === "Normal"
        ).length,
        tags: animeInfo.tags,
        ratings: animeInfo.ratings,
        posterUrl: posterUrl,
        sites: animeInfo.sites,
        followCount,
        viewCount,
      };
    }),

  getAnimeEpisodes: publicProcedure
    .input(z.object({ animeId: z.number() }))
    .query(async ({ input }) => {
      const { animeId } = input;

      const episodes = await prisma.animeEpisode.findMany({
        where: { animeId },
        include: { files: true },
        orderBy: [{ type: "asc" }, { episodeIndex: "asc" }],
      });

      return episodes;
    }),

  getEpisodeDetailAndFiles: publicProcedure
    .input(z.object({ episodeId: z.number() }))
    .query(async ({ input }) => {
      const { episodeId } = input;

      const episode = await prisma.animeEpisode.findUnique({
        where: { id: episodeId },
      });

      const files = await prisma.storageIndex.findMany({
        where: {
          episodes: {
            some: {
              id: episodeId,
            },
          },
        },
        include: {
          storage: true,
        },
        orderBy: {
          size: "desc",
        },
      });

      return {
        episode: episode,
        files: files.map((file) => {
          return {
            file: file,
            parseResult: parseFileName(file.name),
          };
        }),
      };
    }),

  getFileTempUrl: publicProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ input }) => {
      const { fileId } = input;

      const file = await prisma.storageIndex.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error("文件不存在");
      }

      const storageService = App.instance.services.getService(StorageService);

      try {
        const tempUrl = await storageService.getFileTempUrl(file);
        return { tempUrl };
      } catch (error) {
        throw new Error("获取临时文件URL失败");
      }
    }),
});
