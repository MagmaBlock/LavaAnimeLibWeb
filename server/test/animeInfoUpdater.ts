import { AnimeService } from "../services/anime/service";
import { App } from "../services/app";

const app = new App();
const prisma = app.prisma;

const animeService = app.services.getService(AnimeService);
await animeService.updateAllAnimeInfoBefore(
  new Date(Date.now() - 1000 * 60 * 60 * 24)
);
