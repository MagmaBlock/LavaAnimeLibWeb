import type { StorageIndex } from "@prisma/client";

export type AnimeEpisodeLinkResult = {
  totalConnectedCount: number;
  videoEpisodeNotFound: StorageIndex[];
};
