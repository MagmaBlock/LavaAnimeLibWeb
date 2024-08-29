import { useLocalStorage, useThrottleFn } from "@vueuse/core";
import ArtPlayer from "artplayer";

export const useAnimeVideoPlayerStore = defineStore(
  "animeVideoPlayerStore",
  () => {
    // states
    const animeStore = useAnimeStore();
    const artPlayer = ref<ArtPlayer | null>(null);
    const message = useMessage();
    const rememberRate = useLocalStorage("rememberRate", false);

    // actions
    function createPlayer(url?: string) {
      artPlayer.value = new ArtPlayer({
        container: "#artplayer-app",
        url: url ?? "",
        autoplay: true,
        muted: true,
        theme: "#3b82f6",
        volume: 1,
        autoMini: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        playsInline: true,
        lang: "zh-cn",
        lock: true,
        autoOrientation: true,
        airplay: true,
        settings: [
          {
            html: "记住播放倍速",
            tooltip: rememberRate.value ? "记住" : "关闭",
            switch: rememberRate.value,
            onSwitch: function (item) {
              const nextState = !item.switch;
              rememberRate.value = nextState;
              item.tooltip = nextState ? "记住" : "关闭";
              return nextState;
            },
          },
        ],
        controls: [],
      });
    }

    function setVideoUrl(url: string, autoplay = true) {
      if (!artPlayer.value) return createPlayer(url);
      artPlayer.value.switchUrl(url);
      if (autoplay) {
        artPlayer.value.once("ready", () => {
          artPlayer.value?.play();
        });
      }
    }

    // computed

    // watch

    // 尝试在被浏览器限制时静音开播
    watch(artPlayer, () => {
      if (!artPlayer.value) return;
      artPlayer.value.on("ready", () => {
        if (!artPlayer.value) return;
        const count = usePageLifeCycleStore().clickCount;
        if (count > 0) {
          artPlayer.value.muted = false;
          artPlayer.value.play();
        } else {
          message.info("已为您静音开播, 可手动解除静音");
        }
      });
    });

    // 播放器出错损坏处理
    // watch(artPlayer, () => {
    //   if (!artPlayer.value) return;
    //   artPlayer.value.on("error", (error, reconnectTime) => {
    //     console.log(error, reconnectTime);
    //     if (reconnectTime == 5) {
    //       artPlayer.value?.destroy();
    //       createPlayer();
    //       message.error("无法连接到此播放节点，请尝试换一个节点或检查网络", {
    //         duration: 10000,
    //       });
    //     }
    //   });
    // });

    // 记录播放速率变化
    watch(artPlayer, () => {
      if (!artPlayer.value) return;
      artPlayer.value.on("video:ratechange", (e) => {
        const rate = artPlayer.value?.playbackRate;
        if (typeof rate === "number") {
          localStorage.setItem("playbackRate", rate.toString());
        }
      });
    });

    // (每次) 视频能够播放时, 更改播放速率
    watch(artPlayer, () => {
      if (!artPlayer.value) return;
      artPlayer.value.on("video:canplaythrough", () => {
        const rate = localStorage.getItem("playbackRate");
        if (typeof rate === "string" && rememberRate.value) {
          artPlayer.value!.playbackRate = parseFloat(rate);
        }
      });
    });

    const updateNextEpisodeButton = () => {
      if (!artPlayer.value) return;
      artPlayer.value.controls.update({
        name: "next",
        index: 20,
        position: "left",
        html: '<i class="art-icon" style="display: flex;width: 26px;height: 26px;margin-top: 1px"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" fill="currentColor"></path></svg></i>',
        tooltip: "下一话",
        click: useThrottleFn(() => {
          animeStore.switchToNextEpisode();
        }, 1000),
        disable: !animeStore.findNextEpisode(),
      });
    };

    // 监听剧集变化, 重新检查是否有可以播放的下一话
    watch(artPlayer, updateNextEpisodeButton);
    watch(() => animeStore.activeFileId, updateNextEpisodeButton);

    // 视频结束连播提示
    watch(artPlayer, () => {
      if (!artPlayer.value) return;
      artPlayer.value.on(
        "video:timeupdate",
        useThrottleFn(() => {
          // 如果视频总长度 < 20s 或者没有下一话, 返回
          if (artPlayer.value!.duration < 20 || !animeStore.findNextEpisode())
            return;
          const endingTime =
            artPlayer.value!.duration - artPlayer.value!.currentTime;
          // 即将下一话
          if (endingTime <= 10) {
            artPlayer.value!.notice.show = `将在 ${Math.round(
              endingTime
            )} 秒后播放下一话`;
          }
        }, 1000)
      );
    });

    // 视频结束切换下一话
    watch(artPlayer, () => {
      if (!artPlayer.value) return;
      artPlayer.value.on("video:ended", () => {
        const nextEp = animeStore.findNextEpisode();
        if (nextEp) animeStore.switchToNextEpisode();
      });
    });

    return {
      artPlayer,
      createPlayer,
      setVideoUrl,
    };
  }
);
