import { z } from "zod";
import { publicProcedure, router } from "../../../../trpc";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";

const storageService = App.instance.services.getService(StorageService);

export const adminStorageIndexRouter = router({
  // 扫描指定路径
  scan: publicProcedure
    .input(z.object({ path: z.string(), storageId: z.string() }))
    .mutation(async ({ input }) => {
      const storage = await storageService.getStorage(input.storageId);
      if (!storage) {
        throw new Error("存储器不存在");
      }
      const indexManager = storageService.getIndexManager(storage);
      const scannedCount = await indexManager.scan(input.path);
      return { success: true, scannedCount };
    }),

  // 获取指定路径下的文件索引
  getDirContents: publicProcedure
    .input(z.object({ path: z.string(), storageId: z.string() }))
    .query(async ({ input }) => {
      const storage = await storageService.getStorage(input.storageId);
      if (!storage) {
        throw new Error("存储器不存在");
      }
      const indexManager = storageService.getIndexManager(storage);
      return await indexManager.getDirContents(input.path);
    }),

  // 获取存储器列表
  getAllStorage: publicProcedure.query(async () => {
    return await storageService.getAllStorage();
  }),
});
