import { prisma } from "~/server/src/context/prisma";

const anime = await prisma.anime.findUnique({
  where: { id: 2321 },
  include: {
    tags: true,
    sites: true,
    ratings: true,
    episodes: true,
    files: true,
    userCollects: true,
    userViews: true,
  },
});

console.log(anime);
