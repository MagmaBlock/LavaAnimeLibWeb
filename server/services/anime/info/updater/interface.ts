/**
 * 一种从番剧关联站点获取数据信息的信息更新器
 * 即通过 Anime 的 AnimeSiteLink 关联
 */
export interface AnimeInfoUpdater {
  /**
   * 从站点获取此站点中对应动画的数据信息，并更新到库内关联到的所有动画
   * @param animeSiteLinkId AnimeSiteLink 的记录 ID
   */
  updateRelationAnimes(animeSiteLinkId: string): Promise<void>;
}
