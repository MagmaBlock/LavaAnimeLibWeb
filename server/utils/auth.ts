// server/utils/auth.ts
import type { User } from "@prisma/client"; // User 类型来自 Prisma
import type { H3Event } from "h3";
import { App } from "../services/app";
import { UserService } from "../services/user/service";
import { z } from "zod";
import { prisma } from "../src/context/prisma";

/**
 * 从 H3Event 中获取认证用户
 * @param event H3Event 对象
 * @returns 用户对象或 null
 */
export async function getUserFromEvent(event: H3Event): Promise<User | null> {
  const authHeader = event.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  // 解析 JWT
  const token = authHeader.substring(7);
  const userService = App.instance.services.getService(UserService);
  const payload = userService.readTokenPayload(token);

  // 确保 payload 和 payload.id 存在且 id 是数字
  const userId = z.number().int().gte(1).safeParse(payload?.id);
  if (!userId.success) return null;
  try {
    return await prisma.user.findFirst({
      where: {
        id: userId.data,
      },
    });
  } catch (error) {
    // 未来可能需要加强错误处理，这里先返回 null
    console.error("Error fetching user from database:", error);
    return null;
  }
}
