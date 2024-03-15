<template>
  <div
    class="relative w-full aspect-w-16 aspect-h-9 bg-black overflow-hidden select-none"
  >
    <div
      id="artContainer"
      class="absolute top-0 w-full h-full select-none"
    ></div>
  </div>
</template>

<script setup>
import Artplayer from "artplayer";
import { useLocalStorage, useThrottleFn } from "@vueuse/core";
import canAutoplay from "can-autoplay";

const store = useAnimeStore();
const message = useMessage();
const refreshPlayer = inject("refreshPlayer");

const rememberRate = useLocalStorage("rememberRate", false);

onMounted(() => {
  const options = {
    autoMini: true,
    autoplay: true,
    theme: "#2563eb",
    hotkey: true,
    volume: 1,
    pip: true,
    mutex: true,
    fullscreen: true,
    fullscreenWeb: true,
    lock: true,
    autoOrientation: true,
    airplay: true,
    fastForward: true,
    container: "#artContainer",
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
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
    controls: [
      {
        name: "next",
        index: 20,
        position: "left",
        html: '<i class="art-icon" style="display: flex;width: 26px;height: 26px;margin-top: 1px"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" fill="currentColor"></path></svg></i>',
        tooltip: "下一话",
        click: useThrottleFn(function () {
          const newEp = store.findNextEpisode();
          if (newEp) store.changeEpisode(newEp);
        }, 1000),
      },
    ],
  };

  const artInstance = reactive(new Artplayer(options));
  store.artInstance = artInstance;

  // 监听文件变化情况
  watch(
    () => store.activeFile,
    async (newFile) => {
      if (!newFile?.url) return;

      try {
        await artInstance.switchUrl(newFile?.url);
      } catch (error) {
        message.error("播放失败, 正在重试");
      }

      // 寻找并生效字幕
      let subtitles = store.fileData.fileList.filter((file) => {
        if (file?.parseResult?.extensionName.type == "subtitle") {
          if (
            file?.parseResult?.episode ==
              store.activeFile?.parseResult.episode ||
            file.name.startsWith(
              store.activeFile.parseResult.extensionName.trueName
            )
          ) {
            return true;
          }
        }
      });
      console.log("找到字幕", subtitles);

      if (subtitles.length) {
        artInstance.subtitle.url = subtitles[0].url;
      }

      if (newFile?.parseResult?.extensionName?.type == "music") {
        message.info(`正在播放音乐 ${newFile?.name}`);
      }
    },
    { immediate: true }
  );

  // 播放器出错损坏处理
  artInstance.on("error", (error, reconnectTime) => {
    console.log(error, reconnectTime);
    if (reconnectTime == 5) {
      // 销毁重建播放器
      refreshPlayer();
      message.error("无法连接到此播放节点，请尝试换一个节点或检查网络", {
        duration: 10000,
      });
    }
  });

  // 播放行为上报
  const reportPlaying = () => {
    if (
      !store.artInstance?.duration ||
      store.activeFile?.parseResult?.extensionName.type != "video"
    )
      return;
    store.reportView(true, "WebPlayer");
  };

  // 视频播放事件触发
  artInstance.on("video:timeupdate", useThrottleFn(reportPlaying, 8000));
  artInstance.on("seek", useThrottleFn(reportPlaying, 3000));
  artInstance.on("video:ended", reportPlaying);

  // 尝试在被浏览器限制时静音开播
  artInstance.on("ready", () => {
    setTimeout(async () => {
      const count = usePageLifeCycle().getClickCount();
      console.log("以下是 Vue 实例挂载后 window 的点击次数：", count);
      if (count > 0) {
        artInstance.play();
      } else {
        artInstance.muted = true;
        artInstance.play();
        message.info("已为您静音开播, 可手动解除静音");
      }
    }, 200);
  });

  // 记录播放速率变化
  artInstance.on("video:ratechange", (e) => {
    const rate = e.target?.playbackRate;
    if (typeof rate == "number") {
      localStorage.setItem("playbackRate", rate);
    }
  });

  // (每次) 视频能够播放时, 更改播放速率
  artInstance.on("video:canplaythrough", () => {
    const rate = localStorage.getItem("playbackRate");
    if (typeof rate == "string" && rememberRate.value) {
      artInstance.video.playbackRate = JSON.parse(rate);
    }
  });

  // 监听文件变化, 重新检查是否有可以播放的下一话
  watch(
    () => store.activeFile,
    () => {
      artInstance.controls.update({
        ...options.controls[0],
        disable: !store.findNextEpisode(),
      });
    },
    { immediate: true }
  );

  // 视频结束连播提示
  artInstance.on(
    "video:timeupdate",
    useThrottleFn(() => {
      // 如果视频总长度 < 20s 或者没有下一话, 返回
      if (artInstance.duration < 20 || !store.findNextEpisode()) return;
      const endingTime = artInstance.duration - artInstance.currentTime;
      // 即将下一话
      if (endingTime <= 10) {
        artInstance.notice.show = `将在 ${Math.round(
          endingTime
        )} 秒后播放下一话`;
      }
    }, 1000)
  );

  // 视频结束切换下一话
  artInstance.on("video:ended", () => {
    const nextEp = store.findNextEpisode();
    if (nextEp) store.changeEpisode(nextEp);
  });

  // 销毁
  onBeforeUnmount(() => {
    artInstance.destroy();
  });
});
</script>

<style>
/* 播放器控制器调整更浅的背景，同时增大底边距, */
.art-video-player > .art-bottom {
  padding-bottom: 10px !important;
  background-image: linear-gradient(#0000, #0006, #0008) !important;
}
/* 为移动端播放器增加左右间距  */
.art-mobile > .art-bottom > .art-controls {
  padding-right: 10px !important;
  padding-left: 10px !important;
}
</style>
