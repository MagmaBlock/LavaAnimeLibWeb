import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";

const app = new App();

const anime = await app.prisma.anime.findFirst({
  where: {
    id: 2200,
  },
  include: {
    files: true,
  },
});

console.log(anime);

if (anime == null) {
  throw new Error("Anime not found");
}

const storageService = app.services.getService(StorageService);

const urls: string[] = [];

for (const file of anime.files) {
  if (file.isDirectory) {
    continue;
  }

  const url = await storageService.getFileTempUrl(file);
  urls.push(url);
}

console.log(urls);
