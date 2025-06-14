import { defineStore } from "pinia";
import moment from "moment";
import { useThrottleFn } from "@vueuse/core";

export const useAnimeViewHistoryStore = defineStore(
  "anime-history-report",
  () => {
    // 控制是否启用历史报告和恢复历史功能的开关
    const enableHistoryReport = ref(false);
    const enableResumeHistory = ref(false);

    // 引入其他相关的store和工具
    const animeStore = useAnimeStore();
    const animeVideoPlayerStore = useAnimeVideoPlayerStore();
    const { $client } = useNuxtApp();
    const { message } = useNaiveUiApiStore();

    // 格式化时间的辅助函数
    const formatTime = (seconds: number) => {
      return moment.utc(seconds * 1000).format("HH:mm:ss");
    };

    // 监听活动文件ID的变化，以恢复播放进度
    watch(
      () => animeStore.activeFileId,
      async (newFileId) => {
        if (!newFileId || !enableResumeHistory.value) return;

        // 获取视频播放进度
        const playProgress =
          await $client.pages.anime.getVideoPlayProgress.query({
            animeId: animeStore.animeId!,
            episodeId: animeStore.activeEpisodeId!,
            fileId: newFileId,
          });

        if (!playProgress) return;

        // 监听播放器实例，设置播放进度
        const unwatch = watch(
          () => animeVideoPlayerStore.artPlayer,
          (player) => {
            if (!player) return;

            player.once("video:canplay", () => {
              const formattedTime = formatTime(playProgress.currentTime!);
              if (playProgress.completed) {
                // 如果视频已看完，只提示用户，不跳转
                message.info(`您上次已看完此视频。`);
              } else {
                // 设置播放器当前时间
                player.currentTime = playProgress.currentTime;
                // 根据进度来源显示不同的提示信息
                if (playProgress.foundBy === "file") {
                  message.info(
                    `此视频上次播放到 ${formattedTime}，已自动跳转。`,
                  );
                } else if (playProgress.foundBy === "episode") {
                  message.info(
                    `此集数上次播放到 ${formattedTime}，已自动跳转。`,
                  );
                }
              }
              unwatch(); // 在成功挂载 once 之后取消 watch
            });
          },
          { immediate: true },
        );
      },
    );

    // 添加事件处理器
    const addEventHandlers = () => {
      if (!enableHistoryReport.value) return;

      const player = animeVideoPlayerStore.artPlayer;
      if (!player) return;

      const reportHistory = useThrottleFn(() => {
        $client.pages.anime.recordUserViewHistory.mutate({
          animeId: animeStore.animeId!,
          episodeId: animeStore.activeEpisodeId!,
          fileId: animeStore.activeFileId!,
          currentTime: player.currentTime,
          totalTime: player.duration,
          watchMethod: "web",
        });
      }, 10000);

      player.on("ready", () => {
        player.on("pause", reportHistory);
        player.on("video:timeupdate", reportHistory);
        player.on("video:ended", reportHistory);
      });
    };

    // 在播放器创建后添加事件处理器
    watch(
      () => animeVideoPlayerStore.artPlayer,
      (player) => {
        if (player) {
          addEventHandlers();
        }
      },
    );

    return {
      enableHistoryReport,
      enableResumeHistory,
    };
  },
);
