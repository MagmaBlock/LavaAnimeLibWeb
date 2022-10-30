<template>
  <!-- 弹弹Play -->
  <a :href="getUrl().ddplayWindows" @click="handleButtonClick('DanDanPlayWindows')"
    v-if="ua.os.name == 'Windows' || allos" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/DanDanPlay.svg" alt="ddplayWindows" class="w-6 h-6">
    <div :class="textClass">弹弹Play <span v-if="allos">Windows 端</span></div>
  </a>
  <!-- 弹弹Play 安卓 -->
  <a :href="getUrl().ddplayAndroid" @click="handleButtonClick('DanDanPlayAndroid')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/DanDanPlay.svg" alt="ddplayWindows" class="w-6 h-6">
    <div :class="textClass">弹弹Play <span v-if="allos">Android / HarmonyOS</span></div>
  </a>
  <!-- PotPlayer -->
  <a :href="getUrl().potplayer" @click="handleButtonClick('PotPlayer')" v-if="ua.os.name == 'Windows' || allos"
    :class="buttonClass">
    <img src="../../../assets/PlayersIcon/PotPlayer.svg" alt="potplayer" class="w-6 h-6">
    <div :class="textClass">PotPlayer</div>
  </a>
  <!-- VLC -->
  <a :href="getUrl().vlc" @click="handleButtonClick('VLC')" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/vlc.svg" alt="vlc" class="w-6 h-6">
    <div :class="textClass">VLC</div>
  </a>
  <!-- IINA -->
  <a :href="getUrl().iina" @click="handleButtonClick('IINA')" v-if="ua.os.name == 'Mac OS' || allos"
    :class="buttonClass">
    <img src="../../../assets/PlayersIcon/iina.svg" alt="iina" class="w-6 h-6">
    <div :class="textClass">IINA</div>
  </a>
  <!-- 复制链接或下载 -->
  <div @click="handleButtonClick('Copy Link / Download')" :data-clipboard-text="this.video.tempUrl" ref="copyBtn"
    :class="buttonClass" class="cursor-pointer">
    <img src="../../../assets/PlayersIcon/Link.svg" alt="copy link" class="w-6 h-6">
    <div :class="textClass">复制链接</div>
  </div>
  <!-- 缓存 -->
  <a :href="this.video.tempUrl" target="_blank" @click="handleButtonClick('Download')" :class="buttonClass">
    <div :class="textClass">缓存</div>
  </a>
</template>

<script>
import Clipboard from 'clipboard'
import uaParser from 'ua-parser-js'

export default {
  data() {
    return {
      ua: uaParser(),
      reportTimes: 0,
      buttonClass: [
        'h-8 py-1 px-2 flex place-items-center',
        'ease-in duration-100 rounded text-xs',
        'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600'
      ],
      textClass: [
        'text-gray-800 dark:text-zinc-100 mx-2'
      ]
    }
  },
  props: {
    video: Object,
    player: Object,
    reporter: Function,
    allos: Boolean
  },
  mounted() {
    this.ua = uaParser()
    const clipboard = new Clipboard(this.$refs.copyBtn);
    clipboard.on("success", function (e) {
      console.log('Copy success:', e);
    });
    clipboard.on("error", function (e) {
      console.log('Copy failed', e);
    });
  },
  methods: {
    handleButtonClick(type) {
      if (this.reportTimes >= 2) return // 最多通过此方式上报两次
      this.reportTimes++
      this.player.art.pause()
      console.log('暂停来自上级的播放器.');
      this.reporter({ type: type })
    },
    getUrl() {
      let urls = {
        ddplayWindows: `ddplay:${encodeURIComponent(this.video.url + "|filePath=" + this.video.name)}`,
        ddplayAndroid: `intent:${this.video.url}#Intent;package=com.xyoye.dandanplay;end`,
        potplayer: `potplayer://${encodeURIComponent(this.video.url)}`,
        vlc: `vlc://${this.video.url}`,
        iina: `iina://weblink?url=${this.video.url}`
      }
      return urls
    }
  }
}
</script>