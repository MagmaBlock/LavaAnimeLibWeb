<template>
  <BasicCard class="select-none relative">
    <!-- 未选择集数的遮罩 -->
    <div class="absolute w-full h-full flex items-center justify-center bg-white bg-opacity-90  rounded-md"
      v-if="!video.url">
      请先选择集数
    </div>
    <div class="flex flex-wrap gap-1 md:gap-2 px-3 py-2">
      <!-- 弹弹Play -->
      <div
        class="h-8 flex bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-200 rounded p-1 px-2 text-xs">
        <img src="../../assets/PlayersIcon/dandanplay.webp" alt="ddplayWindows"
          class="flex items-center justify-center object-contain">
        <div class="flex items-center justify-center text-black text-sm mx-2">弹弹Play</div>
        <a :href="getUrl().ddplayWindows" @click="this.pausePlayer()"
          class="flex items-center justify-center mx-1">Windows 端</a>
        <a :href="getUrl().ddplayAndroid" @click="this.pausePlayer()" class="flex items-center justify-center mx-1">
          Android 端</a>
      </div>
      <!-- 其他 -->
      <a :href="getUrl().potplayer" @click="this.pausePlayer()"
        class="h-8 flex bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-200 rounded py-1 px-2 text-xs">
        <img src="../../assets/PlayersIcon/PotPlayer.svg" alt="potplayer"
          class="flex items-center justify-center object-contain">
        <div class="flex items-center justify-center text-black mx-2">PotPlayer</div>
      </a>
      <a :href="getUrl().vlc" @click="this.pausePlayer()"
        class="h-8 flex bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-200 rounded py-1 px-2 text-xs">
        <img src="../../assets/PlayersIcon/vlc.svg" alt="vlc" class="flex items-center justify-center object-contain">
        <div class="flex items-center justify-center text-black mx-2">VLC</div>
      </a>
      <a :href="getUrl().iina" @click="this.pausePlayer()"
        class="h-8 flex bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-200 rounded py-1 px-2 text-xs">
        <img src="../../assets/PlayersIcon/iina.svg" alt="iina" class="flex items-center justify-center object-contain">
        <div class="flex items-center justify-center text-black mx-2">IINA</div>
      </a>
      <!-- 非播放器 -->
      <div @click="this.pausePlayer()" :data-clipboard-text="this.video.url" ref="copyBtn"
        class="h-8 flex bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-200 rounded py-1 px-2 text-xs">
        <img src="../../assets/PlayersIcon/link.svg" alt="copy link"
          class="flex items-center justify-center object-contain">
        <div class="flex items-center justify-center text-black mx-2">复制链接</div>
      </div>
    </div>
  </BasicCard>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: {
    video: Object,
    player: Object,
  },
  data() {
    return {}
  },
  methods: {
    getUrl() {
      let urls = {
        ddplayWindows: `ddplay:${encodeURIComponent(this.video.url + "|filePath=" + this.video.name)}`,
        ddplayAndroid: `intent:${this.video.url}#Intent;package=com.xyoye.dandanplay;end`,
        potplayer: `potplayer://${this.video.url}`,
        vlc: `vlc://${this.video.url}`,
        iina: `iina://weblink?url=${this.video.url}`
      }
      return urls
    },
    pausePlayer() {
      this.player.art.pause()
      console.log('暂停来自上级的播放器.');
    }
  },
  mounted() {
    const clipboard = new Clipboard(this.$refs.copyBtn);
    clipboard.on("success", function (e) {
      console.log('Copy success:', e);
    });
    clipboard.on("error", function (e) {
      console.log('Copy failed', e);
    });
  }
}
</script>