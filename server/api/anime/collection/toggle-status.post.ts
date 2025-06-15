import { z } from "zod";
import { defineEventHandler, readBody } from "h3";
import { App } from "~/server/services/app";
import { AnimeCollectionService } from "~/server/services/anime/collection/service";
import { getUserFromEvent } from "~/server/utils/auth"; // 假设 auth.ts 在此路径

const bodySchema = z.object({
  animeId: z.number(),
  status: z.enum(["Plan", "Watching", "Finished"]).optional(),
});

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    return {
      success: false,
      message: "用户未登录",
      data: null,
    };
  }

  const parseResult = bodySchema.safeParse(await readBody(event));

  if (parseResult.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parseResult.error.flatten() },
    };
  }

  const { animeId, status } = parseResult.data;
  const userId = user.id;

  try {
    const animeCollectionService = App.instance.services.getService(
      AnimeCollectionService,
    );
    await animeCollectionService.toggleUserAnimeCollectionStatus(
      userId,
      animeId,
      status,
    );
    return {
      success: true,
      message: "修改用户追番状态成功",
      data: null, // tRPC 中此 mutation 不返回数据
    };
  } catch (error: any) {
    console.error("Error in toggle-user-anime-collection-status:", error);
    return {
      success: false,
      message: error.message || "修改用户追番状态失败",
      data: null,
    };
  }
});