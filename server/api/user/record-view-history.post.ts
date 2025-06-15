import { z } from "zod";
import { App } from "~/server/services/app";
import { getUserFromEvent } from "~/server/utils/auth";

const prisma = App.instance.prisma;

const bodySchema = z.object({
  animeId: z.number(),
  episodeId: z.number().optional().nullish(),
  fileId: z.number(),
  currentTime: z.number().optional(),
  totalTime: z.number().optional(),
  userIP: z.string().optional(),
  watchMethod: z.string().optional(),
});

export default defineEventHandler(async (event): Promise<{ success: boolean; message: string; data: null | { errors?: any } }> => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }
  const userId = user.id;

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parsedBody.error.flatten() },
    };
  }

  const {
    animeId,
    episodeId,
    fileId,
    currentTime,
    totalTime,
    userIP,
    watchMethod,
  } = parsedBody.data;

  try {
    const file = await prisma.storageIndex.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      // 根据原逻辑，如果文件不存在，则不执行任何操作，并成功返回
      // 但为了更明确，可以返回一个特定的消息
      return {
        success: true, // 或者 false，取决于业务需求
        message: "文件不存在，未记录观看历史",
        data: null,
      };
    }

    await prisma.animeViewHistory.upsert({
      where: {
        userId_animeId_fileName: {
          userId,
          animeId,
          fileName: file.name,
        },
      },
      update: {
        fileId,
        episodeId: episodeId ?? undefined, // 处理 nullish
        currentTime,
        totalTime,
        userIP,
        watchMethod,
        removed: false,
      },
      create: {
        userId,
        animeId,
        fileName: file.name,
        episodeId: episodeId ?? undefined, // 处理 nullish
        fileId,
        currentTime,
        totalTime,
        userIP,
        watchMethod,
      },
    });

    return {
      success: true,
      message: "观看历史记录成功",
      data: null,
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/user/record-view-history:`, error);
    return {
      success: false,
      message: "记录观看历史失败",
      data: null,
    };
  }
});