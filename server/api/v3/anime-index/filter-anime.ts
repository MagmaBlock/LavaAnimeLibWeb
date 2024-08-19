import { AnimePlatform, Region, Prisma } from "@prisma/client";
import { z } from "zod";
import { App } from "~/server/services/app";

export default defineEventHandler(async (event) => {
  const schema = z.object({
    releaseYear: z.coerce.number().optional(),
    releaseSeason: z.coerce.string().optional(),
    platform: z.nativeEnum(AnimePlatform).optional(),
    region: z.nativeEnum(Region).optional(),
    sort: z.enum(["view", "follow"]).optional().default("view"),
    page: z.coerce.number().optional().default(1),
  });

  const result = schema.safeParse(getQuery(event));

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `无效的查询参数: ${result.error.message}`,
    });
  }

  const { releaseYear, releaseSeason, platform, region, sort, page } =
    result.data;

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
    skip: (page - 1) * 100,
    take: 100,
    include: {
      userViews: true,
    },
  });

  return animes.map((anime) => {
    const views = anime.userViews.length;
    console.log({
      data: { ...anime, userViews: undefined },
      views,
    });

    return {
      data: { ...anime, userViews: undefined },
      views,
    };
  });
});
