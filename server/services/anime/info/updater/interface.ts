import type { AnimeSiteLink } from "@prisma/client";

/**
 * 一种从番剧关联站点获取数据信息的更新器
 * 本类根据 Anime 的 AnimeSiteLink 选用
 */
export interface AnimeInfoUpdater {
  /**
   * 获取此站点中的数据信息，并更新到库内所属动画
   * @param animeSiteLink AnimeSiteLink 的记录
   */
  updateAnimeInfo(animeSiteLink: AnimeSiteLink): Promise<void>;
}
