import { StorageIndex } from "@prisma/client";

export type AnimeEpisodeLinkResult = {
  totalConnectedCount: number;
  videoEpisodeNotFound: StorageIndex[];
};
