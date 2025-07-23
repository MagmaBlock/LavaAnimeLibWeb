import { z } from "zod";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { protectedProcedure, router } from "../../trpc";
import { prisma } from "~/server/src/context/prisma";

export const animeCardRouter = router({
  menu: protectedProcedure
    .input(
      z.object({
        id: z.number().int().gt(0),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const anime = await prisma.anime.findUnique({
        where: { id },
        include: {
          sites: true,
          ratings: true,
          posters: {
            include: {
              file: true,
            },
          },
        },
      });

      if (!anime) {
        throw new Error("Anime not found");
      }

      const storageService = App.instance.services.getService(StorageService);

      const posterOrSmallPoster =
        anime.posters.find((poster) => poster.type === "Poster") ??
        anime.posters.find((poster) => poster.type === "SmallPoster");

      let posterUrl = posterOrSmallPoster?.url;
      if (!posterUrl && posterOrSmallPoster?.file) {
        try {
          posterUrl = await storageService.getFileTempUrl(
            posterOrSmallPoster.file,
          );
        } catch {
          posterUrl = null;
        }
      }

      return {
        id: anime.id,
        name: anime.name,
        originalName: anime.originalName,
        bdrip: anime.bdrip,
        nsfw: anime.nsfw,
        platform: anime.platform,
        date: anime.date,
        releaseYear: anime.releaseYear,
        releaseSeason: anime.releaseSeason,
        region: anime.region,
        sites: anime.sites,
        ratings: anime.ratings,
        poster: posterUrl,
      };
    }),
});
