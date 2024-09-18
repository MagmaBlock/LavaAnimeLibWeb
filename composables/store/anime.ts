import { refThrottled } from "@vueuse/core";

// 定义动画存储
export const useAnimeStore = defineStore("anime", () => {
  // 从路由参数获取动画ID
  const animeId = ref<number | null>(null);
  // 当前活跃的剧集ID
  const activeEpisodeId = ref<number | null>(null);
  // 当前活跃的镜像组名称
  const activeMirrorGroupName = ref<string | null>(null);
  // 当前活跃的文件ID
  const activeFileId = ref<number | null>(null);
  // 当前活跃的存储器ID
  const activeStorageId = ref<string | null>(null);

  const { $client } = useNuxtApp();
  const playerStore = useAnimeVideoPlayerStore();
  const viewHistoryStore = useAnimeViewHistoryStore();
  viewHistoryStore.enableHistoryReport = true;
  viewHistoryStore.enableResumeHistory = true;

  const build = async () => {
    if (animeId.value !== null) {
      activeEpisodeId.value = null;
      activeFileId.value = null;
      activeMirrorGroupName.value = null;
      activeStorageId.value = null;
      mainDataClear();
      animeInfoClear();

      await Promise.all([mainDataExecute(), animeInfoExecute()]);

      // 自动选择推荐的剧集
      if (mainData.value) {
        const recommendedEpisode = mainData.value.episodes.find(
          (ep) => ep.recommended
        );
        if (recommendedEpisode) {
          activeEpisodeId.value = recommendedEpisode.episode.id;
        }
      }

      // 尝试更新动画信息
      tryUpdateAnimeInfo();
    }
  };

  // 获取动画信息
  const {
    data: animeInfo,
    execute: animeInfoExecute,
    status: animeInfoStatus,
    clear: animeInfoClear,
    error: animeInfoError,
  } = useAsyncData(
    () => $client.pages.anime.getAnimeInfo.query({ animeId: animeId.value! }),
    { immediate: false, lazy: true } // 不立即执行，懒加载
  );

  // 获取动画的主要数据
  const {
    data: mainData,
    execute: mainDataExecute,
    status: mainDataStatus,
    clear: mainDataClear,
  } = useAsyncData(
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
    () =>
      $client.pages.anime.getFileTempUrls.query({
        fileIds: [activeFileId.value!],
      }),
    { immediate: false, lazy: true }
  );

  // 计算当前活跃的剧集
  const activeEpisode = computed(() => {
    if (!mainData.value) return null;
    return (
      mainData.value.episodes.find(
        (episode) => episode.episode.id === activeEpisodeId.value
      ) || null
    );
  });

  // 计算当前活跃的镜像组
  const activeMirrorGroup = computed(() => {
    if (!mainData.value) return null;
    return (
      mainData.value.mirrorGroups.find(
        (group) => group.fileName === activeMirrorGroupName.value
      ) || null
    );
  });

  // 监听animeId的变化，重新获取所有信息并清空现有信息
  watch(refThrottled(animeId, 1000), async () => {
    if (animeId.value) await build();
  });

  // 当剧集被选中时，自动选中合适的文件
  watch(refThrottled(activeEpisodeId, 1000), (newEpisodeId) => {
    if (playerStore.artPlayer) playerStore.artPlayer.pause();
    if (newEpisodeId && activeEpisode.value) {
      const recommendedMirrorGroupName =
        activeEpisode.value.recommendedMirrorGroupName;
      if (recommendedMirrorGroupName) {
        activeMirrorGroupName.value = recommendedMirrorGroupName;
      }
    }
  });

  // 监听 activeMirrorGroupName 的变化，自动选择合适的文件
  watch(refThrottled(activeMirrorGroupName, 1000), (newMirrorGroupName) => {
    if (newMirrorGroupName && activeMirrorGroup.value) {
      const availableFiles = activeMirrorGroup.value.fileIds.filter(
        (fileId) => {
          const file = mainData.value?.files.find((f) => f.id === fileId);
          return (
            file &&
            (!activeStorageId.value || file.storageId === activeStorageId.value)
          );
        }
      );

      if (availableFiles.length > 0) {
        activeFileId.value = availableFiles[0];
      }
    } else if (newMirrorGroupName === null && mainData.value) {
      // 如果 activeMirrorGroupName 是 null，自动选择第一个文件
      const firstFile = mainData.value.files[0];
      if (firstFile) {
        activeFileId.value = firstFile.id;
        activeMirrorGroupName.value =
          mainData.value.mirrorGroups.find((group) =>
            group.fileIds.includes(firstFile.id)
          )?.fileName || null;
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
    if (newStorageId && activeMirrorGroup.value) {
      const fileIdInThisStorage = activeMirrorGroup.value.fileIds.find(
        (fileId) =>
          mainData.value?.files.find(
            (file) => file.id === fileId && file.storageId === newStorageId
          )
      );
      if (fileIdInThisStorage) {
        activeFileId.value = fileIdInThisStorage;
      }
    }
  });

  // 尝试寻找是否有下一集
  const findNextEpisode = () => {
    if (!mainData.value || !activeEpisodeId.value) return null;
    const currentIndex = mainData.value.episodes.findIndex(
      (ep) => ep.episode.id === activeEpisodeId.value
    );
    if (
      currentIndex === -1 ||
      currentIndex === mainData.value.episodes.length - 1
    ) {
      return null;
    }
    return mainData.value.episodes[currentIndex + 1];
  };

  // 切换到下一集
  const switchToNextEpisode = () => {
    const nextEpisode = findNextEpisode();
    if (nextEpisode) {
      activeEpisodeId.value = nextEpisode.episode.id;
      return true;
    }
    return false;
  };

  // 尝试更新动画信息
  const tryUpdateAnimeInfo = async () => {
    if (!animeId.value) return;
    const { isUpdated } = await $client.pages.anime.tryUpdateAnimeInfo.mutate({
      animeId: animeId.value,
    });

    if (isUpdated) await Promise.all([mainDataExecute(), animeInfoExecute()]);
  };

  return {
    animeId,
    activeEpisodeId,
    activeFileId,
    activeStorageId,
    activeMirrorGroupName,
    animeInfo,
    animeInfoStatus,
    animeInfoError,
    mainData,
    mainDataStatus,
    activeEpisode,
    activeMirrorGroup,
    fileTempUrls,
    fileTempUrlsExecute,
    fileTempUrlsStatus,
    fileTempUrlsError,
    findNextEpisode,
    switchToNextEpisode,
  };
});
