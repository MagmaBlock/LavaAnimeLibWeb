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
  connectSites?: {
    animeId?: number; // createAnime 时不需指定
    sites: Partial<AnimeSiteLink>[];
  };
  connectFiles?: {
    animeId?: number; // createAnime 时不需指定
    files: StorageIndex[];
  };
};
