<template>
  <!-- 弹弹Play -->
  <a :href="getUrl().ddplayWindows" @click="handleButtonClick('DanDanPlayWindows')"
    v-if="ua.os.name == 'Windows' || allos" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/DanDanPlay.svg" alt="ddplayWindows" class="w-6 h-6">
    <div class="text-gray-800 mx-2">弹弹Play</div>
  </a>
  <!-- 弹弹Play 安卓 -->
  <a :href="getUrl().ddplayAndroid" @click="handleButtonClick('DanDanPlayAndroid')"
    v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/DanDanPlay.svg" alt="ddplayWindows" class="w-6 h-6">
    <div class="text-gray-800 mx-2">弹弹Play 概念版</div>
  </a>
  <!-- PotPlayer -->
  <a :href="getUrl().potplayer" @click="handleButtonClick('PotPlayer')" v-if="ua.os.name == 'Windows' || allos"
    :class="buttonClass">
    <img src="../../../assets/PlayersIcon/PotPlayer.svg" alt="potplayer" class="w-6 h-6">
    <div class="text-gray-800 mx-2">PotPlayer</div>
  </a>
  <!-- VLC -->
  <a :href="getUrl().vlc" @click="handleButtonClick('VLC')" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/vlc.svg" alt="vlc" class="w-6 h-6">
    <div class="text-gray-800 mx-2">VLC</div>
  </a>
  <!-- IINA -->
  <a :href="getUrl().iina" @click="handleButtonClick('IINA')" v-if="ua.os.name == 'Mac OS' || allos"
    :class="buttonClass">
    <img src="../../../assets/PlayersIcon/iina.svg" alt="iina" class="w-6 h-6">
    <div class="text-gray-800 mx-2">IINA</div>
  </a>
  <!-- 复制链接或下载 -->
  <div @click="handleButtonClick('Copy Link / Download')" :data-clipboard-text="this.video.tempUrl" ref="copyBtn"
    @click.shift="download(this.video.url)" :class="buttonClass">
    <img src="../../../assets/PlayersIcon/Link.svg" alt="copy link" class="w-6 h-6">
    <div class="text-gray-800 mx-2">复制链接</div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import uaParser from 'ua-parser-js'

export default {
  data() {
    return {
      ua: uaParser(),
      reportTimes: 0,
      buttonClass: 'h-8 flex place-items-center bg-gray-100 text-blue-600 hover:bg-gray-200 active:bg-gray-300 ease-in duration-100 rounded py-1 px-2 text-xs'
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
    download(url) {
      window.open(url, '_blank')
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