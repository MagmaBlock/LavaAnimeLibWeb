import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import { AnimePlatform, Region } from "@prisma/client";
import { App } from "~/server/services/app";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";

// 定义请求体的 Zod Schema，与原 tRPC input 保持一致，并优化分页参数
const bodySchema = z.object({
  releaseYear: z.number().optional(),
  releaseSeason: z.string().optional(),
  platform: z.nativeEnum(AnimePlatform).optional(),
  region: z.nativeEnum(Region).optional(),
  sort: z.enum(["view", "follow"]).optional().default("view"),
  take: z.number().int().min(1).optional().default(20),
  skip: z.number().int().min(0).optional().default(0),
});

export default defineEventHandler(async (event) => {
  // 读取并校验请求体
  const bodyParseResult = await readBody(event).then(body => bodySchema.safeParse(body));

  if (!bodyParseResult.success) {
    // 根据 API 规范，HTTP 状态码为 200，业务失败通过 success: false 表示
    return {
      success: false,
      message: "请求参数错误",
      data: {
        errors: bodyParseResult.error.flatten().fieldErrors, // 提供详细错误信息
      },
    };
  }

  const {
    releaseYear,
    releaseSeason,
    platform,
    region,
    sort,
    take,
    skip,
  } = bodyParseResult.data;

  try {
    const prisma = App.instance.prisma;
    const animePictureService = App.instance.services.getService(AnimePictureSerivce);

    const whereClause = {
      releaseYear,
      releaseSeason,
      platform,
      region,
    };

    const orderByClause: any = {};
    if (sort === "view") {
      orderByClause.userViews = { _count: "desc" };
    } else if (sort === "follow") {
      orderByClause.userCollects = { _count: "desc" };
    }
    // 如果有其他排序条件，可以在此扩展

    const animes = await prisma.anime.findMany({
      where: whereClause,
      orderBy: Object.keys(orderByClause).length > 0 ? [orderByClause] : undefined, // Prisma orderBy expects an array for multiple sort conditions or a single object
      take: take,
      skip: skip,
      include: {
        userViews: true, // 用于计算浏览量
        // 如果需要收藏数用于排序或显示，也应 include userCollects
        // userCollects: true, 
      },
    });

    const mappedAnimes = await Promise.all(
      animes.map(async (anime) => {
        return {
          id: anime.id,
          name: anime.name,
          bdrip: anime.bdrip,
          nsfw: anime.nsfw,
          platform: anime.platform,
          date: anime.date, // Date 对象在 JSON 序列化时会转为 ISO 字符串
          releaseYear: anime.releaseYear,
          releaseSeason: anime.releaseSeason,
          region: anime.region,
          poster: await animePictureService.getAnimePoster(anime.id, true),
          views: anime.userViews.length,
        };
      }),
    );

    const totalAnimes = await prisma.anime.count({
      where: whereClause,
    });

    // 构建成功响应，data 字段为对象
    return {
      success: true,
      message: "筛选动漫列表成功",
      data: {
        animes: mappedAnimes,
        total: totalAnimes,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
      },
    };
  } catch (error: any) {
    console.error("[LavaAnimeLibWeb API Error][filter-animes.post.ts]:", error);
    // 构建失败响应
    return {
      success: false,
      message: error.message || "服务器处理请求时发生内部错误",
      data: null, // 或者包含 errorCode 的对象: { errorCode: "INTERNAL_SERVER_ERROR" }
    };
  }
});