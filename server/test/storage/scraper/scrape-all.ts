import { App } from "../../../services/app";
import { LavaAnimeLibV2Scraper } from "../../../services/storage/scraper/v2";
import { StorageService } from "../../../services/storage/service";

const app = new App();
const prisma = app.prisma;
const storage = await prisma.storage.findFirst({
  where: { id: "2AG" },
});
if (!storage) {
  throw new Error("未找到存储库");
}

const start = Date.now();
const scraper = new LavaAnimeLibV2Scraper(storage);
const results = await scraper.scrapeStartsWith("/");
const newAnimes = results.filter((r) => r.createAnime);

// console.log(JSON.stringify(results));

console.log(newAnimes);

console.log(
  `挂削了 ${newAnimes.length} 个新 Anime, 耗时 ${Date.now() - start}`
);

for (const result of results) {
  await app.services
    .getService(StorageService)
    .applyStorageScraperResult(result);
}

console.log("生效完成");