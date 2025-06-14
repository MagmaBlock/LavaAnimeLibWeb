<template>
  <!-- 复制链接 -->
  <AnimePlayerActionBarIcon
    v-if="isSupported"
    icon="/PlayersIcon/Link.svg"
    @click="
      handleButtonClick('Copy Link');
      copy();
    "
    class="cursor-pointer relative"
  >
    <Transition name="fade">
      <div
        v-if="copied"
        class="absolute border-2 border-blue-500 inset-0 rounded-md"
      ></div>
    </Transition>
    <span v-if="!copied">复制</span>
    <span v-else>成功</span>
  </AnimePlayerActionBarIcon>
  <!-- 缓存 -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/download.svg"
    :href="store.activeFile?.url"
    @click="handleButtonClick('Download')"
  >
    缓存
  </AnimePlayerActionBarIcon>
  <!-- "显示全部" 未打开前的显示位置 -->
  <slot name="showAll"></slot>
  <!-- 弹弹Play -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/DanDanPlay.svg"
    :href="getUrl().ddplayWindows"
    @click="handleButtonClick('DanDanPlayWindows')"
    v-if="ua.os.name == 'Windows' || props.allos"
  >
    弹弹Play <span v-if="props.allos" class="ml-1 text-xs">(Windows)</span>
  </AnimePlayerActionBarIcon>
  <!-- 弹弹Play 安卓 -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/DanDanPlay.svg"
    :href="getUrl().ddplayAndroid"
    @click="handleButtonClick('DanDanPlayAndroid')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    弹弹Play <span v-if="props.allos" class="ml-1 text-xs">(Android)</span>
  </AnimePlayerActionBarIcon>
  <!-- PotPlayer -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/PotPlayer.svg"
    :href="getUrl().potplayer"
    @click="handleButtonClick('PotPlayer')"
    v-if="ua.os.name == 'Windows' || props.allos"
  >
    PotPlayer
  </AnimePlayerActionBarIcon>
  <!-- VLC -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/vlc.svg"
    :href="getUrl().vlc"
    @click="handleButtonClick('VLC')"
  >
    VLC
  </AnimePlayerActionBarIcon>
  <!-- IINA -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/iina.svg"
    :href="getUrl().iina"
    @click="handleButtonClick('IINA')"
    v-if="ua.os.name == 'Mac OS' || props.allos"
  >
    IINA
  </AnimePlayerActionBarIcon>
  <!-- nPlayer -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/nplayer.svg"
    :href="getUrl().nPlayer"
    @click="handleButtonClick('nPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS|iOS/i) || props.allos"
  >
    nPlayer
  </AnimePlayerActionBarIcon>
  <!-- MXPlayer -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/mxplayer.svg"
    :href="getUrl().mxPlayerPro"
    @click="handleButtonClick('MXPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    MXPlayer Pro
  </AnimePlayerActionBarIcon>
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/mxplayer.svg"
    :href="getUrl().mxPlayer"
    @click="handleButtonClick('MXPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    MXPlayer
  </AnimePlayerActionBarIcon>
  <!-- MPV -->
  <AnimePlayerActionBarIcon
    icon="/PlayersIcon/mpv.svg"
    :href="getUrl().mpv"
    @click="handleButtonClick('mpv')"
    v-if="props.allos"
  >
    MPV (暂未实现...)
  </AnimePlayerActionBarIcon>
</template>

<script setup>
import { useClipboard, useThrottleFn } from "@vueuse/core";
import uaParser from "ua-parser-js";

const store = useAnimeStore();
const ua = uaParser();
const { copy, copied, isSupported } = useClipboard({
  source: computed(() => store.activeFile?.url),
  legacy: true,
});

const props = defineProps({
  allos: Boolean,
});

/**
 * 处理点击按钮事件
 * @param {String} type
 */
function handleButtonClick(type) {
  useThrottleFn(store.reportView(false, type), 2000);
}

const getUrl = () => {
  return {
    ddplayWindows: `ddplay:${encodeURIComponent(
      store.activeFile?.url + "|filePath=" + store.activeFile?.name,
    )}`,
    ddplayAndroid: `intent:${store.activeFile?.url}#Intent;package=com.xyoye.dandanplay;end`,
    potplayer: `potplayer://${store.activeFile?.url}`,
    vlc: `vlc://${store.activeFile?.url}`,
    iina: `iina://weblink?url=${store.activeFile?.url}`,
    mpv: `mpv://weblink?url=${encodeURIComponent(store.activeFile?.url)}`,
    nPlayer: `nplayer-${store.activeFile?.url}`,
    mxPlayer: `intent:${store.activeFile?.url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${store.activeFile?.name};end`,
    mxPlayerPro: `intent:${store.activeFile?.url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${store.activeFile?.name};end`,
  };
};
</script>
