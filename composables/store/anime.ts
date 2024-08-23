import { defineStore } from "pinia";

export const useAnimeStore = defineStore("anime", () => {
  // 从路由参数获取动画ID
  const animeId = ref<number | null>(null);
  // 当前活跃的剧集ID
  const activeEpisodeId = ref<number | null>(null);

  const { $client } = useNuxtApp();

  // 获取动画的所有剧集
  const {
    data: episodes,
    execute: episodesExecute,
    status: episodesStatus,
    clear: episodesClear,
  } = useAsyncData(
    "animeEpisodes",
    () =>
      $client.pages.anime.getAnimeEpisodes.query({ animeId: animeId.value! }),
    { immediate: false, lazy: true }
  );

  // 获取特定剧集的详细信息
  const {
    data: episodeDetails,
    execute: episodeDetailsExecute,
    status: episodeDetailsStatus,
    clear: episodeDetailsClear,
  } = useAsyncData(
    "anime-episode-details",
    () =>
      $client.pages.anime.getEpisodeDetailAndFiles.query({
        episodeId: activeEpisodeId.value!,
      }),
    { immediate: false, lazy: true }
  );

  // animeId 变化时重新获取所有信息并清空现有信息
  watch(animeId, () => {
    if (animeId.value !== null) {
      activeEpisodeId.value = null;
      episodesClear();
      episodeDetailsClear();
      episodesExecute();
    }
  });

  // 被选中的剧集变化时获取其详细信息
  watch(activeEpisodeId, (newEpisodeId) => {
    if (newEpisodeId !== null) {
      episodeDetailsClear();
      episodeDetailsExecute();
    }
  });

  return {
    animeId,
    activeEpisodeId,
    episodes,
    episodesExecute,
    episodesStatus,
    episodeDetails,
    episodeDetailsExecute,
    episodeDetailsStatus,
  };
});
