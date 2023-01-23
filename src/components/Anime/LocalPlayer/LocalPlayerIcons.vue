<template>
  <!-- 复制链接 -->
  <div ref="copyBtn" :data-clipboard-text="this.video.tempUrl">
    <LocalPlayerIcon icon="/PlayersIcon/Link.svg" @click="handleButtonClick('Copy Link')"
      class="cursor-pointer">
      复制
    </LocalPlayerIcon>
  </div>
  <!-- 缓存 -->
  <LocalPlayerIcon icon="/PlayersIcon/download.svg" :href="this.video.tempUrl"
    @click="handleButtonClick('Download')">
    缓存
  </LocalPlayerIcon>
  <!-- "显示全部" 未打开前的显示位置 -->
  <slot name="showAll"></slot>
  <!-- 弹弹Play -->
  <LocalPlayerIcon icon="/PlayersIcon/DanDanPlay.svg" :href="getUrl().ddplayWindows"
    @click="handleButtonClick('DanDanPlayWindows')" v-if="ua.os.name == 'Windows' || allos">
    弹弹Play <span v-if="allos">Windows</span>
  </LocalPlayerIcon>
  <!-- 弹弹Play 安卓 -->
  <LocalPlayerIcon icon="/PlayersIcon/DanDanPlay.svg" :href="getUrl().ddplayAndroid"
    @click="handleButtonClick('DanDanPlayAndroid')" v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos">
    弹弹Play <span v-if="allos">Android</span>
  </LocalPlayerIcon>
  <!-- PotPlayer -->
  <LocalPlayerIcon icon="/PlayersIcon/PotPlayer.svg" :href="getUrl().potplayer"
    @click="handleButtonClick('PotPlayer')" v-if="ua.os.name == 'Windows' || allos">
    PotPlayer
  </LocalPlayerIcon>
  <!-- VLC -->
  <LocalPlayerIcon icon="/PlayersIcon/vlc.svg" :href="getUrl().vlc" @click="handleButtonClick('VLC')">
    VLC
  </LocalPlayerIcon>
  <!-- IINA -->
  <LocalPlayerIcon icon="/PlayersIcon/iina.svg" :href="getUrl().iina" @click="handleButtonClick('IINA')"
    v-if="ua.os.name == 'Mac OS' || allos">
    IINA
  </LocalPlayerIcon>
  <!-- nPlayer -->
  <LocalPlayerIcon icon="/PlayersIcon/nplayer.svg" :href="getUrl().nPlayer"
    @click="handleButtonClick('nPlayer')" v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS|iOS/i) || allos">
    nPlayer
  </LocalPlayerIcon>
  <!-- MXPlayer -->
  <LocalPlayerIcon icon="/PlayersIcon/mxplayer.svg" :href="getUrl().mxPlayerPro"
    @click="handleButtonClick('MXPlayer')" v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos">
    MXPlayer Pro
  </LocalPlayerIcon>
  <LocalPlayerIcon icon="/PlayersIcon/mxplayer.svg" :href="getUrl().mxPlayer"
    @click="handleButtonClick('MXPlayer')" v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos">
    MXPlayer
  </LocalPlayerIcon>
  <!-- MPV -->
  <LocalPlayerIcon icon="/PlayersIcon/mpv.svg" :href="getUrl().mpv" @click="handleButtonClick('mpv')"
    v-if="allos">
    MPV (暂未实现...)
  </LocalPlayerIcon>
</template>

<script>
import Clipboard from 'clipboard'
import uaParser from 'ua-parser-js'
import LocalPlayerIcon from './LocalPlayerIcon.vue'

export default {
  inject: ["reportNewView"],
  data() {
    return {
      ua: uaParser(),
      reportTimes: 0,
    };
  },
  props: {
    video: Object,
    player: Object,
    allos: Boolean
  },
  mounted() {
    this.ua = uaParser();
    const clipboard = new Clipboard(this.$refs.copyBtn);
    clipboard.on("success", function (e) {
      console.log("Copy success:", e);
      $message.success('复制成功')
    });
    clipboard.on("error", function (e) {
      console.log("Copy failed", e);
      $message.warning('复制失败')
    });
  },
  methods: {
    handleButtonClick(type) {
      if (this.reportTimes >= 2)
        return; // 最多通过此方式上报两次
      this.reportTimes++;
      this.player.art.pause();
      this.reportNewView({ type: type });
      console.log(`按钮 ${type} 触发了一次上报播放量，剩余 ${this.reportTimes} 次.`);
    },
    getUrl() {
      return {
        ddplayWindows: `ddplay:${encodeURIComponent(this.video.url + "|filePath=" + this.video.name)}`,
        ddplayAndroid: `intent:${this.video.url}#Intent;package=com.xyoye.dandanplay;end`,
        potplayer: `potplayer://${this.video.url}`,
        vlc: `vlc://${this.video.url}`,
        iina: `iina://weblink?url=${this.video.url}`,
        mpv: `mpv://weblink?url=${encodeURIComponent(this.video.url)}`,
        nPlayer: `nplayer-${this.video.url}`,
        mxPlayer: `intent:${this.video.url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${this.video.name};end`,
        mxPlayerPro: `intent:${this.video.url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${this.video.name};end`
      };
    }
  },
  components: { LocalPlayerIcon }
}
</script>