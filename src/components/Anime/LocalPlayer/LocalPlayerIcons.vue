<template>
  <!-- 复制链接 -->
  <div ref="copyBtn" :data-clipboard-text="this.video.tempUrl">
    <LocalPlayerIcon class="cursor-pointer" icon="/PlayersIcon/Link.svg"
                     @click="handleButtonClick('Copy Link')">
      复制
    </LocalPlayerIcon>
  </div>
  <!-- 缓存 -->
  <LocalPlayerIcon :href="this.video.tempUrl" icon="/PlayersIcon/download.svg"
                   @click="handleButtonClick('Download')">
    缓存
  </LocalPlayerIcon>
  <!-- "显示全部" 未打开前的显示位置 -->
  <slot name="showAll"></slot>
  <!-- 弹弹Play -->
  <LocalPlayerIcon v-if="ua.os.name == 'Windows' || allos" :href="getUrl().ddplayWindows"
                   icon="/PlayersIcon/DanDanPlay.svg" @click="handleButtonClick('DanDanPlayWindows')">
    弹弹Play <span v-if="allos">Windows</span>
  </LocalPlayerIcon>
  <!-- 弹弹Play 安卓 -->
  <LocalPlayerIcon v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos" :href="getUrl().ddplayAndroid"
                   icon="/PlayersIcon/DanDanPlay.svg"
                   @click="handleButtonClick('DanDanPlayAndroid')">
    弹弹Play <span v-if="allos">Android</span>
  </LocalPlayerIcon>
  <!-- PotPlayer -->
  <LocalPlayerIcon v-if="ua.os.name == 'Windows' || allos" :href="getUrl().potplayer"
                   icon="/PlayersIcon/PotPlayer.svg" @click="handleButtonClick('PotPlayer')">
    PotPlayer
  </LocalPlayerIcon>
  <!-- VLC -->
  <LocalPlayerIcon :href="getUrl().vlc" icon="/PlayersIcon/vlc.svg" @click="handleButtonClick('VLC')">
    VLC
  </LocalPlayerIcon>
  <!-- IINA -->
  <LocalPlayerIcon v-if="ua.os.name == 'Mac OS' || allos" :href="getUrl().iina" icon="/PlayersIcon/iina.svg"
                   @click="handleButtonClick('IINA')">
    IINA
  </LocalPlayerIcon>
  <!-- nPlayer -->
  <LocalPlayerIcon v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS|iOS/i) || allos" :href="getUrl().nPlayer"
                   icon="/PlayersIcon/nplayer.svg"
                   @click="handleButtonClick('nPlayer')">
    nPlayer
  </LocalPlayerIcon>
  <!-- MXPlayer -->
  <LocalPlayerIcon v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos" :href="getUrl().mxPlayerPro"
                   icon="/PlayersIcon/mxplayer.svg"
                   @click="handleButtonClick('MXPlayer')">
    MXPlayer Pro
  </LocalPlayerIcon>
  <LocalPlayerIcon v-if="ua.os.name.match(/Android|Android-x86|HarmonyOS/i) || allos" :href="getUrl().mxPlayer"
                   icon="/PlayersIcon/mxplayer.svg"
                   @click="handleButtonClick('MXPlayer')">
    MXPlayer
  </LocalPlayerIcon>
  <!-- MPV -->
  <LocalPlayerIcon v-if="allos" :href="getUrl().mpv" icon="/PlayersIcon/mpv.svg"
                   @click="handleButtonClick('mpv')">
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
      this.reportNewView({type: type});
      console.log(`按钮 ${type} 触发了一次上报播放量，剩余 ${this.reportTimes} 次.`);
    },
    getUrl() {
      let urls = {
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
      return urls;
    }
  },
  components: {LocalPlayerIcon}
}
</script>