import { prisma } from "~/server/src/context/prisma";
import { App } from "../../../services/app";
import { StorageService } from "../../../services/storage/service";

const app = new App();
const storages = await prisma.storage.findMany();
if (storages.length === 0) {
  throw new Error("未找到存储库");
}

for (const storage of storages) {
  const start = Date.now();
  const storageService = app.services.getService(StorageService);
  const scraper = storageService.getScraper(storage);
  const results = await scraper.scrapeChildFiles("/");
  const newAnimes = results.filter((r) => r.createAnime);

  console.log(
    `挂削了 ${newAnimes.length} 个新 Anime, 耗时 ${Date.now() - start}`,
  );

  for (const result of results) {
    await storageService.applyStorageScraperResult(result);
  }

  console.log("生效完成");
}
