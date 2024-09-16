import { z } from "zod";
import { App } from "~/server/services/app";
import { StorageScrapeResult } from "~/server/services/storage/scraper/types/result";
import { StorageService } from "~/server/services/storage/service";
import { publicProcedure, router } from "~/server/trpc/trpc";

const storageService = App.instance.services.getService(StorageService);

export const adminStorageScrapeRouter = router({
  // 挂削指定路径
  scrapeChildFiles: publicProcedure
    .input(z.object({ path: z.string(), storageId: z.string() }))
    .query(async ({ input }) => {
      const storage = await storageService.getStorage(input.storageId);
      if (!storage) {
        throw new Error("存储器不存在");
      }
      const scraper = storageService.getScraper(storage);
      const results = await scraper.scrapeChildFiles(input.path);
      return { results };
    }),

  // 生效挂削结果
  applyStorageScraperResult: publicProcedure
    .input(z.object({ results: z.array(z.any()) }))
    .mutation(async ({ input }) => {
      const results = input.results as StorageScrapeResult[];
      for (const result of results) {
        await storageService.applyStorageScraperResult(result);
      }

      return;
    }),


});
