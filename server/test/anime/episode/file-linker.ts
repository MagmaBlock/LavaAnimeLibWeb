import { AnimeService } from "~/server/services/anime/service";
import { App } from "~/server/services/app";

const app = new App();

const as = app.services.getService(AnimeService);
const linker = as.getAnimeEpisodeFileLinker();

await linker.linkAllAnimeFiles();
