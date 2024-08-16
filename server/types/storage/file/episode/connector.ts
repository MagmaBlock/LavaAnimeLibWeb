import type { LibFile } from "@prisma/client";

export type EpisodeConnectResult = {
  totalConnectedCount: number;
  videoEpisodeNotFound: LibFile[];
};
