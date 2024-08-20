import { z } from "zod";
import { AnimePlatform, Region } from "@prisma/client";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { publicProcedure, router } from "../../trpc";

export const animeIndexRouter = router({
  filters: publicProcedure.query(async () => {
    const indexMap = await App.instance.prisma.anime.groupBy({
      by: ["releaseYear", "releaseSeason", "platform", "region"],
    });

    const releaseYears = Array.from(
      new Set(
        indexMap.map((item) => item.releaseYear).filter((year) => year !== null)
      )
    ).sort((a, b) => b - a);

    const releaseSeasons = Array.from(
      new Set(
        indexMap
          .map((item) => item.releaseSeason)
          .filter((season) => season !== null)
      )
    ).sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || "Infinity", 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] || "Infinity", 10);
      return numA - numB;
    });

    const platforms = Array.from(
      new Set(
        indexMap
          .map((item) => item.platform)
          .filter((platform) => platform !== null)
      )
    ).sort((a, b) => {
      const order: AnimePlatform[] = ["TV", "Movie", "Web", "OVA", "Other"];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const regions = Array.from(
      new Set(
        indexMap.map((item) => item.region).filter((region) => region !== null)
      )
    ).sort();

    return {
      releaseYears,
      releaseSeasons,
      platforms,
      regions,
    };
  }),

  filterAnime: publicProcedure
    .input(
      z.object({
        releaseYear: z.number().optional(),
        releaseSeason: z.string().optional(),
        platform: z.nativeEnum(AnimePlatform).optional(),
        region: z.nativeEnum(Region).optional(),
        sort: z.enum(["view", "follow"]).optional().default("view"),
        take: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { releaseYear, releaseSeason, platform, region, sort, take, skip } =
        input;

      const animes = await App.instance.prisma.anime.findMany({
        where: {
          releaseYear,
          releaseSeason,
          platform,
          region,
        },
        orderBy: {
          userViews: sort === "view" ? { _count: "desc" } : undefined,
          userCollects:
            sort === "follow"
              ? {
                  _count: "desc",
                }
              : undefined,
        },
        take: take,
        skip: skip,
        include: {
          userViews: true,
          posters: {
            include: {
              file: true,
            },
          },
        },
      });

      const storageService = App.instance.services.getService(StorageService);

      return Promise.all(
        animes.map(async (anime) => {
          const smallPosterOrPoster =
            anime.posters.find((poster) => poster.type === "SmallPoster") ??
            anime.posters.find((poster) => poster.type === "Poster");

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
            id: anime.id,
            name: anime.name,
            bdrip: anime.bdrip,
            nsfw: anime.nsfw,
            platform: anime.platform,
            date: anime.date,
            releaseYear: anime.releaseYear,
            releaseSeason: anime.releaseSeason,
            region: anime.region,
            poster: posterUrl,
            views: anime.userViews.length,
          };
        })
      );
    }),
});
