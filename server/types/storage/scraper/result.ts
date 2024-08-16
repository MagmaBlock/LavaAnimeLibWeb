import type { Anime, AnimeSiteLink, StorageIndex } from "@prisma/client";

/**
 * 挂削器的结果，类似一种指令
 */
export type StorageScrapeResult = {
  createAnime?: Partial<Anime>;
  updateAnime?: {
    animeId: number;
    data: Partial<Anime>;
  };
  connectSite?: {
    animeId?: number; // createAnime 时不需指定
    site: Partial<AnimeSiteLink>;
  };
  connectFile?: {
    animeId?: number; // createAnime 时不需指定
    file: StorageIndex;
  };
};
