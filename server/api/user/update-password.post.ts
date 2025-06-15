import { z } from "zod";
import { defineEventHandler, readBody } from "h3";
import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";
import { getUserFromEvent } from '~/server/utils/auth';

const bodySchema = z.object({
  newPassword: z.string().min(7).max(64),
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

  const { newPassword } = parseResult.data;

  try {
    const userService = App.instance.services.getService(UserService);
    await userService.changePassword(user.id, newPassword);

    return {
      success: true,
      message: "密码更新成功",
      data: null, // 根据规范，成功但无特定数据返回时，data 为 null
    };
  } catch (error) {
    console.error("[API Error /api/v1/user/update-password]: ", error);
    // 在实际应用中，可以根据 error 类型返回更具体的错误信息
    // 例如，如果 userService.changePassword 抛出特定错误
    return {
      success: false,
      message: "密码更新失败",
      data: null,
    };
  }
});