import { z } from "zod";
import { App } from "~/server/services/app";

export default defineEventHandler(async (event) => {
  console.log(getQuery(event));

  const id = z
    .number()
    .int()
    .gt(0)
    .parse(Number(getQuery(event)?.id));

  const anime = await App.instance.prisma.anime.findFirst({
    where: { id: id },
    include: {
      tags: true,
      sites: true,
      ratings: true,
    },
  });

  if (anime === null) {
    throw createError({
      statusCode: 404,
      message: "找不到该番剧",
    });
  }

  return anime;
});
