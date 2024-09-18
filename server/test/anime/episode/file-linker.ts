import { AnimeEpisodeFileLinker } from "~/server/services/anime/episode/file-linker";
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

const linker = new AnimeEpisodeFileLinker();
await linker.linkAllAnimeFiles();

console.log("好了");
