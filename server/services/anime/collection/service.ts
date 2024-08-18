import { AnimeCollectionStatus, type AnimeCollection } from "@prisma/client";
import { App } from "../../app";

/**
 * 管理用户的动画追番
 */
export class AnimeCollectionService {
  /**
   * 创建或更新用户的动漫收藏状态
   *
   * @param userId 用户ID，用于标识收藏所属的用户
   * @param animeId 动漫ID，用于标识被收藏的动漫
   * @param status 收藏状态，用于更新或设置收藏记录的状态
   * @returns 返回创建或更新后的收藏记录
   */
  async upsert(
    userId: number,
    animeId: number,
    status: AnimeCollectionStatus
  ): Promise<AnimeCollection> {
    // 使用upsert操作来实现创建或更新，根据提供的userId和animeId来判断记录是否存在
    // 如果存在，则更新收藏状态；如果不存在，则创建新的收藏记录
    const result = await App.instance.prisma.animeCollection.upsert({
      create: {
        userId,
        animeId,
        status,
      },
      update: {
        status,
      },
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });

    return result;
  }

  /**
   * 删除用户收藏的动漫
   *
   * @param userId 用户的唯一标识符，用于确定哪个用户收藏列表进行更改
   * @param animeId 动漫的唯一标识符，用于确定要从收藏列表中删除哪个动漫
   * @returns 返回删除操作的结果，通常包含受影响的行数等信息
   */
  async remove(userId: number, animeId: number): Promise<AnimeCollection> {
    const result = await App.instance.prisma.animeCollection.delete({
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });

    return result;
  }

  /**
   * 异步获取用户收藏的特定动画
   *
   * 本函数通过用户的ID和动画的ID来查找该用户是否收藏了此动画
   * 它使用Prisma ORM来查询数据库中的动画收藏记录
   *
   * @param userId 用户的ID
   * @param animeId 动画的ID
   * @returns 返回找到的动画收藏记录，如果没有找到则返回null
   */
  async get(userId: number, animeId: number): Promise<AnimeCollection | null> {
    // 使用Prisma ORM的findUnique方法来查找唯一的动画收藏记录
    // 这里通过组合主键(userId_animeId)来确保查找的唯一性
    const result = await App.instance.prisma.animeCollection.findUnique({
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });

    return result;
  }

  /**
   * 获取与指定用户相关的所有动漫收藏
   *
   * 此函数使用Prisma ORM从数据库中查询指定用户的动漫收藏它通过用户的ID来过滤，
   * 并且包括与收藏相关的动漫详细信息这个功能确保了在获取收藏列表时，相关的动漫
   * 信息也会被一并加载，便于进一步的数据处理或展示
   *
   * @param userId 用户ID，用于指定查询哪个用户的动漫收藏
   * @returns 返回一个Promise，解析为包含用户动漫收藏的数组
   */
  async getAllByUser(userId: number) {
    const result = await App.instance.prisma.animeCollection.findMany({
      where: {
        userId,
      },
      include: {
        anime: true,
      },
    });

    return result;
  }

  /**
   * 获取与特定动画关联的所有收藏
   *
   * 本函数使用Prisma ORM从数据库中查询与指定动画ID相关的所有收藏信息
   * 它还包括了用户信息，这使得结果集中的每个收藏项都能够直接访问到关联的用户数据
   *
   * @param animeId 动画的ID，用于定位特定动画的收藏
   * @returns 返回一个Promise，解析为包含与指定动画ID相关联的所有收藏的数组
   */
  async getAllByAnime(animeId: number) {
    const result = await App.instance.prisma.animeCollection.findMany({
      where: {
        animeId,
      },
      include: {
        user: true,
      },
    });

    return result;
  }
}
