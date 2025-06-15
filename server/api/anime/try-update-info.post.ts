import { z } from "zod";
import { App } from "~/server/services/app";
import { AnimeService } from "~/server/services/anime/service";
import { getUserFromEvent } from "~/server/utils/auth";
import moment from "moment";

const bodySchema = z.object({
  animeId: z.number(),
});

interface TryUpdateAnimeInfoResponse {
  isUpdated: boolean;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; message: string; data: TryUpdateAnimeInfoResponse | null | { errors?: any } }> => {
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

  const { animeId } = parsedBody.data;

  try {
    const animeService = App.instance.services.getService(AnimeService);
    const isUpdated = await animeService.updateAnimeInfoBefore(
      animeId,
      moment().subtract(3, "days").toDate(),
    );

    return {
      success: true,
      message: "尝试更新动画信息成功",
      data: { isUpdated },
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/anime/try-update-info:`, error);
    return {
      success: false,
      message: "尝试更新动画信息失败",
      data: null,
    };
  }
});