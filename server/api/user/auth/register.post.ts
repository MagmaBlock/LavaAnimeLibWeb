import { z } from "zod";
import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";
import { defineEventHandler, readBody } from "h3";

const bodySchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  name: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码长度不能少于6位"),
  inviteCode: z.string().min(1, "邀请码不能为空"),
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

  const { email, name, password, inviteCode } = parseResult.data;

  try {
    const userService = App.instance.services.getService(UserService);
    const user = await userService.register(
      email,
      name,
      password,
      inviteCode,
    );

    const token = userService.signTokenByUserId(user.id);

    return {
      success: true,
      message: "注册成功",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          settings: user.settings,
          role: user.role,
        },
      },
    };
  } catch (error: any) {
    let errorMessage = "注册失败";
    if (error.message) {
      errorMessage = error.message;
    }
    // 你可能需要更精细的错误处理逻辑，例如区分邀请码无效、用户已存在等
    return {
      success: false,
      message: errorMessage,
      data: null, // 或者包含 errorCode
    };
  }
});