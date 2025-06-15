import type { User } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import { App } from "../../services/app";
import { StorageService } from "../../services/storage/service";
import { getUserFromEvent } from "../../utils/auth";

const bodySchema = z.object({
  id: z.number().int().gt(0),
});

export default defineEventHandler(async (event) => {
  const user: User | null = await getUserFromEvent(event);
  if (!user) {
    return {
      success: false,
      message: "用户未登录",
      data: null,
    };
  }

  const body = await readBody(event);
  const parsedBody = bodySchema.safeParse(body);

  if (parsedBody.success === false) {
    return {
      success: false,
      message: "请求参数错误",
      data: null,
    };
  }

  const { id } = parsedBody.data;

  try {
    const anime = await App.instance.prisma.anime.findUnique({
      where: { id },
      include: {
        sites: true,
        ratings: true,
        posters: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!anime) {
      return {
        success: false,
        message: "Anime not found",
        data: null,
      };
    }

    const storageService = App.instance.services.getService(StorageService);

    const posterOrSmallPoster =
      anime.posters.find((poster) => poster.type === "Poster") ??
      anime.posters.find((poster) => poster.type === "SmallPoster");

    let posterUrl = posterOrSmallPoster?.url ?? null; // 初始化为 null
    if (!posterUrl && posterOrSmallPoster?.file) {
      try {
        posterUrl = await storageService.getFileTempUrl(
          posterOrSmallPoster.file,
        );
      } catch {
        posterUrl = null;
      }
    }

    return {
      success: true,
      message: "获取成功",
      data: {
        id: anime.id,
        name: anime.name,
        originalName: anime.originalName,
        bdrip: anime.bdrip,
        nsfw: anime.nsfw,
        platform: anime.platform,
        date: anime.date,
        releaseYear: anime.releaseYear,
        releaseSeason: anime.releaseSeason,
        region: anime.region,
        sites: anime.sites,
        ratings: anime.ratings,
        poster: posterUrl,
      },
    };
  } catch (error) {
    console.error("Error processing anime/menu request:", error);
    return {
      success: false,
      message: "服务器内部错误",
      data: null,
    };
  }
});
