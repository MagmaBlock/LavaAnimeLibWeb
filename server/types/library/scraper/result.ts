import type {
  AnimeInfoSource,
  AnimePlatform,
  LibFile,
  Region,
} from "@prisma/client";

/**
 * 挂削器的结果
 */
export type LibraryScrapeResult = {
  anime: LibraryScrapeResultAnime;
  files: LibFile[];
};

/**
 * 描述了被刮削后解析出的 Anime，可进一步用作创建新番，或者对现有番剧进行新文件的关联。
 */
export type LibraryScrapeResultAnime = {
  id?: number; // 如果此项有值，则表示该番剧已存在，不需要创建新番，而是将 files 添加到该番剧中
  name: string;
  originalName?: string;
  bdrip?: boolean;
  nsfw?: boolean;
  platform?: AnimePlatform;
  date?: Date;
  releaseYear?: number;
  releaseSeason?: string;
  region?: Region;

  sites: {
    siteType: AnimeInfoSource;
    siteId: string;
  }[];
};
