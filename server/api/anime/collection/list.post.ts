import { z } from "zod";
import { defineEventHandler, readBody } from "h3";
import { App } from "~/server/services/app";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
import { getUserFromEvent } from "~/server/utils/auth"; // 假设 auth.ts 在此路径
import type { AnimeCollectionStatus } from "@prisma/client"; // 引入枚举类型
import { prisma } from "~/server/src/context/prisma";

// 从 tRPC 迁移过来的 status 枚举
const QueryItemEnum = ["Plan", "Watching", "Finished"] as const;

const bodySchema = z.object({
  status: z.enum(QueryItemEnum),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).optional().default(30),
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

  const { status, page, pageSize } = parseResult.data;
  const userId = user.id;

  try {
    const animePictureService =
      App.instance.services.getService(AnimePictureSerivce);

    const skip = (page - 1) * pageSize;

    const collections = await prisma.animeCollection.findMany({
      where: {
        userId,
        status: status as AnimeCollectionStatus, // 类型断言
      },
      include: {
        anime: {
          include: {
            userViews: true,
          },
        },
      },
      skip,
      take: pageSize,
    });

    const totalCount = await prisma.animeCollection.count({
      where: {
        userId,
        status: status as AnimeCollectionStatus, // 类型断言
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const items = await Promise.all(
      collections.map(async (collection) => {
        return {
          collection: {
            // 根据 tRPC 的返回结构，这里不包含 anime 字段
            id: collection.id,
            userId: collection.userId,
            animeId: collection.animeId,
            status: collection.status,
            createdAt: collection.createdAt,
            updatedAt: collection.updatedAt,
          },
          anime: {
            id: collection.anime.id,
            name: collection.anime.name,
            bdrip: collection.anime.bdrip,
            nsfw: collection.anime.nsfw,
            platform: collection.anime.platform,
            date: collection.anime.date,
            releaseYear: collection.anime.releaseYear,
            releaseSeason: collection.anime.releaseSeason,
            region: collection.anime.region,
            poster: await animePictureService.getAnimePoster(
              collection.anime.id,
              true,
            ),
            views: collection.anime.userViews.length,
          },
        };
      }),
    );

    return {
      success: true,
      message: "获取用户追番列表成功",
      data: {
        totalPages,
        items,
      },
    };
  } catch (error: any) {
    console.error("Error in get-user-anime-collections:", error);
    return {
      success: false,
      message: error.message || "获取用户追番列表失败",
      data: null,
    };
  }
});