import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import { AnimeCollectionService } from "~/server/services/anime/collection/service";
import { App } from "~/server/services/app";
import { getUserFromEvent } from "~/server/utils/auth";

const bodySchema = z.object({
  animeId: z.number(),
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

  const { animeId } = parseResult.data;
  const userId = user.id;

  try {
    const animeCollectionService = App.instance.services.getService(
      AnimeCollectionService,
    );
    const status = await animeCollectionService.getUserAnimeCollectionStatus(
      userId,
      animeId,
    );
    return {
      success: true,
      message: "获取用户追番状态成功",
      data: { status },
    };
  } catch (error: any) {
    console.error("Error in get-user-anime-collection-status:", error);
    return {
      success: false,
      message: error.message || "获取用户追番状态失败",
      data: null,
    };
  }
});
