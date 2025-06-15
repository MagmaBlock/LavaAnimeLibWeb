import { z } from "zod";
import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";
import { defineEventHandler, readBody } from "h3";

const bodySchema = z.object({
  account: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parseResult = bodySchema.safeParse(body);

  if (parseResult.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: {
        errors: parseResult.error.flatten().fieldErrors,
      },
    };
  }

  const { account, password } = parseResult.data;

  try {
    const userService = App.instance.services.getService(UserService);
    const loginResult = await userService.login(account, password);

    return {
      success: true,
      message: "登录成功",
      data: {
        token: loginResult.token,
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name,
          createdAt: loginResult.user.createdAt,
          settings: loginResult.user.settings,
          role: loginResult.user.role,
        },
      },
    };
  } catch (error: any) {
    // 根据实际错误类型和 userService.login 的行为来决定如何返回错误信息
    // 例如，如果 userService.login 在用户不存在或密码错误时抛出特定错误
    let errorMessage = "登录失败";
    if (error.message) {
      errorMessage = error.message;
    }
    // 你可能需要更精细的错误处理逻辑
    return {
      success: false,
      message: errorMessage,
      data: null, // 或者包含 errorCode
    };
  }
});