import { AnimeService } from "~/server/services/anime/service";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";

const app = new App();

const anime = await app.prisma.anime.findUnique({
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
