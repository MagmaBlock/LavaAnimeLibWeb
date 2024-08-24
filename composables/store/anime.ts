import { refThrottled } from "@vueuse/core";

export const useAnimeStore = defineStore("anime", () => {
  // 从路由参数获取动画ID
  const animeId = ref<number | null>(null);
  // 当前活跃的剧集ID
  const activeEpisodeId = ref<number | null>(null);
  // 当前活跃的文件ID
  const activeFileId = ref<number | null>(null);
  // 当前活跃的存储器ID
  const activeStorageId = ref<string | null>(null);

  const { $client } = useNuxtApp();
  const playerStore = useAnimeVideoPlayerStore();

  // 获取动画信息
  const {
    data: animeInfo,
    execute: animeInfoExecute,
    status: animeInfoStatus,
    clear: animeInfoClear,
    error: animeInfoError,
  } = useAsyncData(
    "animeInfo",
    () => $client.pages.anime.getAnimeInfo.query({ animeId: animeId.value! }),
    { immediate: false, lazy: true } // 不立即执行，懒加载
  );

  // 获取动画的所有剧集
  const {
    data: episodes,
    execute: episodesExecute,
    status: episodesStatus,
    clear: episodesClear,
  } = useAsyncData(
    "animeEpisodes",
    () =>
      $client.pages.anime.getAnimeMainData.query({ animeId: animeId.value! }),
    { immediate: false, lazy: true } // 不立即执行，懒加载
  );

  // 获取文件临时URL
  const {
    data: fileTempUrls,
    execute: fileTempUrlsExecute,
    status: fileTempUrlsStatus,
    error: fileTempUrlsError,
  } = useAsyncData(
    "fileTempUrls",
    () =>
      $client.pages.anime.getFileTempUrls.query({
        fileIds: [activeFileId.value!],
      }),
    { immediate: false, lazy: true }
  );

  // 计算当前活跃的剧集
  const activeEpisode = computed(() => {
    if (!episodes.value) return null;
    return (
      episodes.value.episodes.find(
        (episode) => episode.episode.id === activeEpisodeId.value
      ) || null
    );
  });

  // 计算当前活跃的镜像组
  const activeMirrorGroup = computed(() => {
    if (!activeEpisode.value) return null;
    return (
      activeEpisode.value.mirrorGroups.find((group) =>
        group.group.some((file) => file.id === activeFileId.value)
      ) || null
    );
  });

  // 监听animeId的变化，重新获取所有信息并清空现有信息
  watch(refThrottled(animeId, 1000), () => {
    if (animeId.value !== null) {
      activeEpisodeId.value = null;
      activeFileId.value = null;
      episodesClear();
      animeInfoClear();

      episodesExecute();
      animeInfoExecute();
    }
  });

  // 当剧集数据被获取时，自动选中推荐的剧集
  watch(refThrottled(episodes, 1000), (newEpisodes) => {
    if (newEpisodes) {
      activeEpisodeId.value = newEpisodes.recommendedEpisodeId;
    }
  });

  // 当剧集被选中时，自动选中合适的文件
  watch(refThrottled(activeEpisodeId, 1000), (newEpisodeId) => {
    if (newEpisodeId) {
      if (activeEpisode.value?.recommendedMirrorGroup) {
        // TODO: 如果当前有选中的 storage，则优先选择该 storage 的文件
        activeFileId.value =
          activeEpisode.value.recommendedMirrorGroup.files[0].id;
      }
    }
  });

  // 监听 activeFileId 的变化，自动获取临时URL并播放
  watch(refThrottled(activeFileId, 1000), async (newFileId) => {
    if (newFileId) {
      await fileTempUrlsExecute();
      const fileTempUrl = fileTempUrls.value?.find(
        (tempUrl) => tempUrl.fileId === newFileId
      );
      if (fileTempUrl && fileTempUrl.tempUrl) {
        playerStore.setVideoUrl(fileTempUrl.tempUrl);
      } else {
        console.error("获取临时URL失败");
      }
    }
  });

  // 监听 activeStorageId 的变化，自动选中对应存储器合适的文件
  watch(refThrottled(activeStorageId, 1000), (newStorageId) => {
    if (newStorageId) {
      const mirrorGroupFileThisStorage = activeMirrorGroup.value?.group.find(
        (file) => file.storageId === newStorageId
      );
      if (mirrorGroupFileThisStorage) {
        activeFileId.value = mirrorGroupFileThisStorage.id;
      }
    }
  });

  return {
    animeId,
    activeEpisodeId,
    activeFileId,
    activeStorageId,
    animeInfo,
    animeInfoExecute,
    animeInfoStatus,
    animeInfoError,
    animeInfoClear,
    episodes,
    episodesExecute,
    episodesStatus,
    episodesClear,
    activeEpisode,
    activeMirrorGroup,
    fileTempUrls,
    fileTempUrlsExecute,
    fileTempUrlsStatus,
    fileTempUrlsError,
  };
});
