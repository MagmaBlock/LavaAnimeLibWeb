// server/utils/auth.ts
import type { H3Event } from "h3";
import { App } from "../services/app";
import { UserService } from "../services/user/service";
import type { User } from "@prisma/client"; // 假设 User 类型从 Prisma Client 导入

/**
 * 从 H3Event 中获取认证用户
 * @param event H3Event 对象
 * @returns Promise<User | null> 用户对象或 null
 */
export async function getUserFromEvent(event: H3Event): Promise<User | null> {
  const authHeader = event.headers.get("Authorization");
  let user: User | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const userService = App.instance.services.getService(UserService);
    const payload = userService.readTokenPayload(token); // 假设 readTokenPayload 返回 { id: number } 或 null
    if (payload && typeof payload.id === 'number') { // 确保 payload 和 payload.id 存在且 id 是数字
      try {
        user = await App.instance.prisma.user.findFirst({
          where: {
            id: payload.id,
          },
        });
      } catch (error) {
        console.error("Error fetching user from database:", error);
        // 根据需要处理数据库错误，这里返回 null
        return null;
      }
    }
  }
  return user;
}