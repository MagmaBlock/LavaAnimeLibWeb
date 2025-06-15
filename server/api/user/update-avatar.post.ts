import { z } from "zod";
import { defineEventHandler, readBody } from "h3";
import { App } from "~/server/services/app";
import { getUserFromEvent } from '~/server/utils/auth';
// UserService 和 StorageService 在这个特定的 API 中没有直接使用，但为了保持与原文件结构一致性，暂时保留
// import { StorageService } from "~/server/services/storage/service";
// import { UserService } from "~/server/services/user/service";

const bodySchema = z.object({
  url: z.string().url(),
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
      data: { errors: parseResult.error.flatten() }, // 可以选择性返回 zod 错误详情
    };
  }

  const { url } = parseResult.data;

  try {
    const updatedUser = await App.instance.prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: url },
    });

    return {
      success: true,
      message: "头像更新成功",
      data: {
        avatarUrl: updatedUser.avatarUrl,
      },
    };
  } catch (error) {
    console.error("[API Error /api/v1/user/update-avatar]: ", error);
    return {
      success: false,
      message: "头像更新失败",
      data: null,
    };
  }
});