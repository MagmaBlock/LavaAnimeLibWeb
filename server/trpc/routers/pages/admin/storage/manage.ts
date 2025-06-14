import { z } from "zod";
import { publicProcedure, router } from "../../../../trpc";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { StorageType, StorageScraper } from "@prisma/client";

const storageService = App.instance.services.getService(StorageService);
const prisma = App.instance.prisma;

export const adminStorageManagerRouter = router({
  // 获取所有存储器
  getAllStorage: publicProcedure.query(async () => {
    return await storageService.getAllStorage();
  }),

  // 获取单独的存储器
  getStorage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.storage.findUnique({
        where: { id: input.id },
      });
    }),

  // 创建存储器
  createStorage: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string(),
        description: z.string().optional().nullable(),
        type: z.nativeEnum(StorageType),
        config: z.string().optional().nullable(),
        noNSFW: z.boolean().default(false),
        noDownload: z.boolean().default(false),
        bindScraper: z.nativeEnum(StorageScraper).optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      // 检查是否存在相同 id 的存储器
      const existingStorage = await prisma.storage.findUnique({
        where: { id: input.id },
      });

      if (existingStorage) {
        throw new Error(`已存在 ID 为 "${input.id}" 的存储器，请使用其他 ID。`);
      }

      return await prisma.storage.create({
        data: input,
      });
    }),

  // 更新存储器
  updateStorage: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        type: z.nativeEnum(StorageType).optional(),
        config: z.string().optional().nullable(),
        noNSFW: z.boolean().optional(),
        noDownload: z.boolean().optional(),
        bindScraper: z.nativeEnum(StorageScraper).optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return await prisma.storage.update({
        where: { id },
        data: updateData,
      });
    }),

  // 删除存储器
  deleteStorage: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await prisma.storage.delete({
        where: { id: input.id },
      });
    }),
});
