import { z } from "zod";
import { defineEventHandler, readBody, H3Event } from "h3";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { getUserFromEvent } from '~/server/utils/auth';

const bodySchema = z.object({}); // API 规范要求 POST，即使是获取信息，也校验 body

export default defineEventHandler(async (event: H3Event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证或会话无效",
      data: null,
    };
  }

  // 校验 body
  // 根据规范，所有 API 都是 POST，请求体是 JSON。
  // 如果这个 API 在语义上是 GET (获取信息)，并且不期望有实际的 body 内容，
  // 那么应该期望一个空的 JSON 对象 {}。
  let parsedBody;
  try {
    const rawBody = await readBody(event);
    parsedBody = bodySchema.safeParse(rawBody);

    if (parsedBody.success === false) {
      return {
        success: false,
        message: "请求参数错误",
        data: { errors: parsedBody.error.flatten() },
      };
    }
  } catch (error) {
    // 通常 readBody 失败意味着请求体不是有效的 JSON
    console.error("[API /api/user/get-info] Error reading or parsing body:", error);
    return {
      success: false,
      message: "请求体格式无效",
      data: null,
    };
  }

  // 主要逻辑
  try {
    let avatarUrl = user.avatarUrl;
    if (typeof user.avatarFileId === 'number' && !avatarUrl) {
      try { // 细粒度的 try-catch 用于头像获取
        const storageIndex = await App.instance.prisma.storageIndex.findUnique({
          where: {
            id: user.avatarFileId,
          },
        });
        if (storageIndex) {
          avatarUrl = await App.instance.services
            .getService(StorageService)
            .getFileTempUrl(storageIndex);
        }
      } catch (avatarError: any) {
        console.error(`[API /api/user/get-info] User ${user.id} avatar fetch failed (FileID: ${user.avatarFileId}):`, avatarError.message);
        // 头像获取失败，不中断主流程，avatarUrl 将保持为 user.avatarUrl 或 undefined/null
      }
    }

    const responseData = {
      id: user.id,
      name: user.name, // user.name 对应 get-change-name-meta 的 username
      email: user.email,
      avatar: avatarUrl || null, // avatarUrl 对应 get-avatar 的 avatarUrl
    };

    return {
      success: true,
      message: "用户信息获取成功",
      data: responseData,
    };
  } catch (error: any) { // 捕获主要逻辑中的其他未知错误
    console.error("[API Error /api/user/get-info] Failed to get user info:", error);
    return {
      success: false,
      message: "获取用户信息失败",
      data: null,
    };
  }
});