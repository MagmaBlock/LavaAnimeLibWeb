import { AnimeCollectionStatus, type AnimeCollection } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { App } from "../../app";

/**
 * 管理用户的动画追番
 */
export class AnimeCollectionService {
  /**
   * 获取用户追番的情况
   * @param userId 用户ID
   * @param animeId 动画ID
   * @returns 返回用户的追番记录，如果不存在则返回null
   */
  async getUserAnimeCollectionStatus(
    userId: number,
    animeId: number
  ): Promise<AnimeCollection | null> {
    const animeCollection =
      await App.instance.prisma.animeCollection.findUnique({
        where: {
          userId_animeId: {
            userId: userId,
            animeId: animeId,
          },
        },
      });

    return animeCollection;
  }

  /**
   * 修改用户追番的状态
   * @param userId 用户ID
   * @param animeId 动画ID
   * @param status 可选的新状态
   */
  async toggleUserAnimeCollectionStatus(
    userId: number,
    animeId: number,
    status?: AnimeCollectionStatus
  ): Promise<void> {
    const anime = await App.instance.prisma.anime.findUnique({
      where: { id: animeId },
      select: { id: true },
    });
    if (!anime) {
      throw new TRPCError({ code: "NOT_FOUND", message: "动画不存在" });
    }

    const existingCollection =
      await App.instance.prisma.animeCollection.findUnique({
        where: {
          userId_animeId: {
            userId: userId,
            animeId: animeId,
          },
        },
      });

    if (existingCollection) {
      if (status) {
        // 如果已存在收藏记录且提供了新状态，则更新记录
        await App.instance.prisma.animeCollection.update({
          where: {
            id: existingCollection.id,
          },
          data: {
            status: status,
          },
        });
      } else {
        // 如果已存在收藏记录但未提供新状态，则删除记录
        await App.instance.prisma.animeCollection.delete({
          where: {
            id: existingCollection.id,
          },
        });
      }
    } else {
      // 如果不存在收藏记录，则创建新记录
      const newStatus = status || AnimeCollectionStatus.Watching;
      await App.instance.prisma.animeCollection.create({
        data: {
          userId: userId,
          animeId: animeId,
          status: newStatus,
        },
      });
    }
  }
}
