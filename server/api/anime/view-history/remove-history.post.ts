import { z } from "zod";
import { App } from "~/server/services/app";
import { getUserFromEvent } from "~/server/utils/auth";

const bodySchema = z.object({
  historyId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    return {
      success: false,
      message: "未登录",
      data: null,
    };
  }

  const body = bodySchema.safeParse(await readBody(event));

  if (body.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: null,
    };
  }

  const { historyId } = body.data;

  const updatedHistory =
    await App.instance.prisma.animeViewHistory.updateMany({
      where: {
        id: historyId,
        userId: user.id,
      },
      data: {
        removed: true,
      },
    });

  if (updatedHistory.count === 0) {
    return {
      success: false,
      message: "未找到指定的观看历史记录",
      data: null,
    };
  }

  return {
    success: true,
    message: "观看历史记录已成功删除",
    data: null,
  };
});