import { z } from "zod";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { publicProcedure, router } from "~/server/trpc/trpc";

const storageService = App.instance.services.getService(StorageService);

export const adminStoragePathSelectorRouter = router({
  // 获取存储器列表
  getAllStorage: publicProcedure.query(async () => {
    return await storageService.getAllStorage();
  }),

  // 获取指定路径下的内容
  getPathContents: publicProcedure
    .input(z.object({ path: z.string(), storageId: z.string() }))
    .query(async ({ input }) => {
      const storage = await storageService.getStorage(input.storageId);
      if (!storage) {
        throw new Error("存储器不存在");
      }
      const indexManager = storageService.getIndexManager(storage);
      return await indexManager.getDirContents(input.path);
    }),
});
