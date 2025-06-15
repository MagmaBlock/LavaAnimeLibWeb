import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { App } from "~/server/services/app";
import { AnimePictureSerivce } from "~/server/services/anime/picture/serivce";
// import { UserService } from "~/server/services/user/service"; // 不再直接使用
import { getUserFromEvent } from "~/server/utils/auth"; // 导入新的认证函数

const prisma = App.instance.prisma;

const bodySchema = z.object({
  animeId: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: { errors: parsedBody.error.flatten() },
    };
  }

  const { animeId } = parsedBody.data;

  try {
    const animeInfo = await prisma.anime.findUnique({
      where: { id: animeId },
      include: {
        tags: true,
        ratings: true,
        posters: {
          include: {
            file: true,
          },
        },
        sites: true,
        episodes: true,
      },
    });

    if (!animeInfo) {
      return {
        success: false,
        message: "动画不存在",
        data: null,
      };
    }

    const followCount = await prisma.animeCollection.count({
      where: { animeId },
    });

    const viewCount = await prisma.animeViewHistory.count({
      where: { animeId },
    });

    const animePictureService =
      App.instance.services.getService(AnimePictureSerivce);

    const posterUrl = await animePictureService.getAnimePoster(animeId, true);

    return {
      success: true,
      message: "获取动画信息成功",
      data: {
        id: animeInfo.id,
        title: animeInfo.name,
        originalTitle: animeInfo.originalName,
        summary: animeInfo.summary,
        bdrip: animeInfo.bdrip,
        nsfw: animeInfo.nsfw,
        platform: animeInfo.platform,
        releaseDate: animeInfo.date,
        totalEpisodes: animeInfo.episodes.filter(
          (episode) => episode.type === "Normal",
        ).length,
        tags: animeInfo.tags,
        ratings: animeInfo.ratings,
        posterUrl: posterUrl,
        sites: animeInfo.sites,
        followCount,
        viewCount,
      },
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/anime/get-info:`, error);
    if (error instanceof TRPCError) {
      return {
        success: false,
        message: error.message,
        data: { code: error.code },
      };
    }
    return {
      success: false,
      message: "获取动画信息失败",
      data: null,
    };
  }
});
