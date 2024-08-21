import { AnimeService } from "~/server/services/anime/service";
import { App } from "~/server/services/app";

const app = new App();

// // 这是解除所有文件关联的;
// const allEpisodes = await app.prisma.animeEpisode.findMany();
// console.log(allEpisodes.length);

// for (const episode of allEpisodes) {
//   console.log(episode.id);

//   await app.prisma.animeEpisode.update({
//     where: {
//       id: episode.id,
//     },
//     data: {
//       files: {
//         set: [],
//       },
//     },
//   });
// }

const as = app.services.getService(AnimeService);
const linker = as.getAnimeEpisodeFileLinker();

await linker.linkAllAnimeFiles();

console.log("好了");
