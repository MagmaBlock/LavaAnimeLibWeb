import { z } from "zod";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { getUserFromEvent } from "~/server/utils/auth";

const prisma = App.instance.prisma;

const bodySchema = z.object({
  fileIds: z.array(z.number()),
});

interface FileTempUrlResult {
  fileId: number;
  tempUrl: string | null;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; message: string; data: FileTempUrlResult[] | { errors?: any } | null }> => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parsedBody.error.flatten() },
    };
  }

  const { fileIds } = parsedBody.data;
  const storageService = App.instance.services.getService(StorageService);

  try {
    const files = await prisma.storageIndex.findMany({
      where: { id: { in: fileIds } },
      include: { anime: { select: { nsfw: true } } },
    });

    const noNSFWStorages = await prisma.storage.findMany({
      where: { noNSFW: true },
      select: { id: true },
    });
    const noNSFWStorageIds = noNSFWStorages.map((storage) => storage.id);

    const result = await Promise.all(
      fileIds.map(async (fileId): Promise<FileTempUrlResult> => {
        const file = files.find((f) => f.id === fileId);
        if (!file) return { fileId, tempUrl: null };

        // 如果文件所属的动画是 nsfw，且存储在 noNSFW 的存储中，则不返回链接
        if (file.anime?.nsfw && noNSFWStorageIds.includes(file.storageId)) {
          return { fileId, tempUrl: null };
        }

        try {
          const tempUrl = await storageService.getFileTempUrl(file);
          return { fileId, tempUrl };
        } catch (error) {
          console.error(`获取文件 ${fileId} 的临时下载链接失败:`, error);
          return { fileId, tempUrl: null };
        }
      }),
    );

    return {
      success: true,
      message: "获取文件临时链接成功",
      data: result,
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/file/get-temp-urls:`, error);
    return {
      success: false,
      message: "获取文件临时链接失败",
      data: null,
    };
  }
});