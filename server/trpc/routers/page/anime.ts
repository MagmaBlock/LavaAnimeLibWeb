import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";

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
});
