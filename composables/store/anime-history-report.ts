import { defineStore } from "pinia";

export const useAnimeHistoryReportStore = defineStore(
  "anime-history-report",
  () => {
    const animeStore = useAnimeStore();
    const animeVideoPlayerStore = useAnimeVideoPlayerStore();

    
  }
);
