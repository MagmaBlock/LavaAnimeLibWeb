<template>
  <!-- 复制链接 -->
  <LocalPlayerIcon
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
        class="absolute border-2 border-blue-500 inset-0 rounded-sm"
      ></div>
    </Transition>
    <span v-if="!copied">复制</span>
    <span v-else>成功</span>
  </LocalPlayerIcon>
  <!-- 缓存 -->
  <LocalPlayerIcon
    icon="/PlayersIcon/download.svg"
    :href="store.activeFile?.url"
    @click="handleButtonClick('Download')"
  >
    缓存
  </LocalPlayerIcon>
  <!-- "显示全部" 未打开前的显示位置 -->
  <slot name="showAll"></slot>
  <!-- 弹弹Play -->
  <LocalPlayerIcon
    icon="/PlayersIcon/DanDanPlay.svg"
    :href="getUrl().ddplayWindows"
    @click="handleButtonClick('DanDanPlayWindows')"
    v-if="ua.os.name == 'Windows' || props.allos"
  >
    弹弹Play <span v-if="props.allos">Windows</span>
  </LocalPlayerIcon>
  <!-- 弹弹Play 安卓 -->
  <LocalPlayerIcon
    icon="/PlayersIcon/DanDanPlay.svg"
    :href="getUrl().ddplayAndroid"
    @click="handleButtonClick('DanDanPlayAndroid')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    弹弹Play <span v-if="props.allos">Android</span>
  </LocalPlayerIcon>
  <!-- PotPlayer -->
  <LocalPlayerIcon
    icon="/PlayersIcon/PotPlayer.svg"
    :href="getUrl().potplayer"
    @click="handleButtonClick('PotPlayer')"
    v-if="ua.os.name == 'Windows' || props.allos"
  >
    PotPlayer
  </LocalPlayerIcon>
  <!-- VLC -->
  <LocalPlayerIcon
    icon="/PlayersIcon/vlc.svg"
    :href="getUrl().vlc"
    @click="handleButtonClick('VLC')"
  >
    VLC
  </LocalPlayerIcon>
  <!-- IINA -->
  <LocalPlayerIcon
    icon="/PlayersIcon/iina.svg"
    :href="getUrl().iina"
    @click="handleButtonClick('IINA')"
    v-if="ua.os.name == 'Mac OS' || props.allos"
  >
    IINA
  </LocalPlayerIcon>
  <!-- nPlayer -->
  <LocalPlayerIcon
    icon="/PlayersIcon/nplayer.svg"
    :href="getUrl().nPlayer"
    @click="handleButtonClick('nPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS|iOS/i) || props.allos"
  >
    nPlayer
  </LocalPlayerIcon>
  <!-- MXPlayer -->
  <LocalPlayerIcon
    icon="/PlayersIcon/mxplayer.svg"
    :href="getUrl().mxPlayerPro"
    @click="handleButtonClick('MXPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    MXPlayer Pro
  </LocalPlayerIcon>
  <LocalPlayerIcon
    icon="/PlayersIcon/mxplayer.svg"
    :href="getUrl().mxPlayer"
    @click="handleButtonClick('MXPlayer')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || props.allos"
  >
    MXPlayer
  </LocalPlayerIcon>
  <!-- MPV -->
  <LocalPlayerIcon
    icon="/PlayersIcon/mpv.svg"
    :href="getUrl().mpv"
    @click="handleButtonClick('mpv')"
    v-if="props.allos"
  >
    MPV (暂未实现...)
  </LocalPlayerIcon>
</template>

<script setup>
import uaParser from "ua-parser-js";
import { onMounted, computed, ref } from "vue";

import LocalPlayerIcon from "./LocalPlayerIcon.vue";
import { useAnimeStore } from "../../../store/Anime";
import { useClipboard, useThrottleFn } from "@vueuse/core";

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
      store.activeFile?.url + "|filePath=" + store.activeFile?.name
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
