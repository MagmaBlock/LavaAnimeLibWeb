import { z } from "zod";
import { defineEventHandler, readBody } from "h3";
import { App } from "~/server/services/app";
import { getUserFromEvent } from '~/server/utils/auth';
import { prisma } from "~/server/src/context/prisma";

const bodySchema = z.object({
  newName: z.string().min(1).max(30),
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

  const { newName } = parseResult.data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: newName },
    });

    return {
      success: true,
      message: "用户名更新成功",
      data: {
        name: updatedUser.name,
      },
    };
  } catch (error) {
    console.error("[API Error /api/v1/user/update-username]: ", error);
    // 这里可以根据 Prisma 的错误类型，判断是否是唯一约束冲突等，并返回更具体的错误信息
    // 例如： if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
    return {
      success: false,
      message: "用户名更新失败", // 可以考虑更具体的错误，如“用户名已存在”
      data: null,
    };
  }
});