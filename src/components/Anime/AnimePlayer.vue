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
import { ref, reactive, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { useAnimeStore } from "../../store/Anime";
import { useThrottleFn } from "@vueuse/core";
import canAutoplay from "can-autoplay";

const store = useAnimeStore();
const refreshPlayer = inject("refreshPlayer");

onMounted(() => {
  const options = {
    setting: true,
    autoMini: true,
    playbackRate: true,
    aspectRatio: true,
    autoplay: true,
    theme: "#2563eb",
    // poster: "https://anime-img.5t5.top/assets/no-bgm-bg.jpg",
    hotkey: true,
    volume: 1,
    pip: true,
    mutex: true,
    fullscreen: true,
    fullscreenWeb: true,
    flip: true,
    lock: true,
    autoOrientation: true,
    airplay: true,
    fastForward: true,
    container: "#artContainer",
  };

  const artInstance = reactive(new Artplayer(options));
  store.artInstance = artInstance;

  watch(
    () => store.activeFile,
    async (newFile) => {
      try {
        await artInstance.switchUrl(newFile?.url);
      } catch (error) {
        $message.error("播放失败, 正在重试", {
          duration: 6000,
        });
      }

      if (newFile?.parseResult?.extensionName?.type == "music") {
        $message.info(`正在播放音乐 ${newFile?.name}`);
      }
    }
  );

  // 播放器出错损坏处理
  artInstance.on("error", (error, reconnectTime) => {
    console.log(error, reconnectTime);
    if (reconnectTime == 5) {
      // 销毁重建播放器
      refreshPlayer();
      $message.error("无法连接到此播放节点，请尝试换一个节点或检查网络", {
        duration: 10000,
      });
    }
  });

  const reportPlaying = () => {
    if (
      !store.artInstance?.duration ||
      store.activeFile?.parseResult?.extensionName.type != "video"
    )
      return;
    store.reportView(true, "WebPlayer");
  };

  // 视频播放事件触发
  artInstance.on("video:timeupdate", useThrottleFn(reportPlaying, 10000));
  artInstance.on("seek", reportPlaying);
  artInstance.on("pause", reportPlaying);

  // 尝试在被浏览器限制时静音开播
  artInstance.on("ready", () => {
    setTimeout(async () => {
      let canAutoplayResult = (await canAutoplay.video()).result;
      console.log("Can autoplay? Test result: ", canAutoplayResult);
      if (!canAutoplayResult) {
        artInstance.muted = true;
        artInstance.play();
        $message.info("已为您静音开播, 可手动解除静音", { duration: 3000 });
      }
    }, 200);
  });

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
