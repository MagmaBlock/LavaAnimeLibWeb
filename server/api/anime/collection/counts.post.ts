import type { AnimeCollectionStatus } from "@prisma/client";
import { defineEventHandler } from "h3";
import { getUserFromEvent } from "~/server/utils/auth"; // 假设 auth.ts 在此路径
import { prisma } from "~/server/src/context/prisma";

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    return {
      success: false,
      message: "用户未登录",
      data: null,
    };
  }

  const userId = user.id;

  try {
    const counts = await prisma.animeCollection.groupBy({
      by: ["status"],
      where: {
        userId,
      },
      _count: {
        status: true,
      },
    });

    const result: Record<AnimeCollectionStatus, number> = {
      Plan: 0,
      Watching: 0,
      Finished: 0,
    };

    counts.forEach((count) => {
      // count.status 的类型是 AnimeCollectionStatus
      // count._count.status 的类型是 number | null，但在这里我们知道它不为 null
      if (count.status && count._count.status !== null) {
        result[count.status] = count._count.status;
      }
    });

    return {
      success: true,
      message: "获取用户追番统计成功",
      data: result,
    };
  } catch (error: any) {
    console.error("Error in get-user-anime-collection-counts:", error);
    return {
      success: false,
      message: error.message || "获取用户追番统计失败",
      data: null,
    };
  }
});