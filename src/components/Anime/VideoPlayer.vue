<template>
  <div class="relative w-full aspect-w-16 aspect-h-9 bg-black sm:rounded-md overflow-hidden select-none">
    <!-- ArtPlayer -->
    <div ref="artRef" class="absolute top-0 w-full h-full la-art-player" v-show="playType == 'canPlay'"></div>
    <!-- 各种非视频情况处理 -->
    <div class="absolute w-full h-full px-8 text-white text-center grid place-items-center"
      v-show="playType !== 'canPlay'">
      <div v-if="playType == 'notSeleted'"> 请选择集数后播放 </div>
      <div v-if="playType == 'notSupport'">
        当前播放的视频格式可能不受浏览器支持, 请使用下方的按钮调用您设备上的播放器进行播放
        <span class="text-gray-400 hover:text-white cursor-pointer ml-2 text-xs" @click="forcePlay()">强制播放</span>
        <div> 类型: {{ video.extensionName.result }} </div>
      </div>
      <div v-if="playType == 'notVideo'" class="grid place-items-center">
        选择了不支持预览的非视频文件, 您可以下载它
        <div class="text-gray-400 text-xs">
          类型: {{ video.extensionName.result }} 大小: {{ bytesToSize(video.size) }}
        </div>
        <a class="bg-white/20 hover:bg-white/30 text-gray-400 text-[13px] rounded-md w-fit px-4 py-0.5 mt-1"
          target="_blank" :href="video.tempUrl">
          下载此文件
        </a>
      </div>
      <!-- 音乐 (调用浏览器原生播放) -->
      <audio controls v-if="playType == 'music'" class="w-full" ref="musicPlayer">
        <source :src="video.tempUrl" type="audio/mpeg">
        您的浏览器不支持该音频格式, 请尝试下载
        <a class="bg-white/20 hover:bg-white/30 text-gray-400 text-[13px] rounded-md w-fit px-4 py-0.5 ml-1"
          target="_blank" :href="video.tempUrl">
          下载此文件
        </a>
      </audio>
    </div>
  </div>
</template>

<style>

/* 为播放器控制器增加 margin, 兼容异性屏设备 */
.la-art-player>div>.art-bottom {
  margin-bottom: 12px;
  background-image: linear-gradient(#0000, #0005, #0000);
}
</style>

<script>
import Artplayer from "artplayer";

export default {
  data() {
    return {
      art: null, // ArtPlayer
      option: {
        url: this.video.url || '',
        setting: true,
        theme: '#2563eb',
        autoMini: true,
        playbackRate: true,
        aspectRatio: true,
        poster: 'https://anime-img.5t5.top/assets/no-bgm-bg.jpg',
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        flip: true,
        whitelist: ['*'],
        lock: true,
        autoOrientation: true,
        airplay: true,
      },
      playType: 'notSeleted'
    };
  },
  props: {
    video: Object,
    reporter: Function
  },
  methods: {
    changeVideo(newVideo) {
      this.art.notice.show = '正在切换...'
      this.art.pause()
      if (newVideo.type == 'file') { // 为文件
        if (newVideo.extensionName.type == 'video') { // 为视频
          if (newVideo.extensionName.result == 'MP4视频') {
            this.playType = 'canPlay'
            this.art.url = newVideo.url // 播放视频
            setTimeout(() => this.art.play(), 200); // 准备播放
            setTimeout(() => this.prepareToReportNewView(), 2000) // 准备上报播放量
          }
          else if (newVideo.extensionName.result == 'MKV视频') {
            this.playType = 'notSupport'
            this.art.url = newVideo.url // 播放视频
            this.art.pause()
          } else {
            this.playType = 'notSupport'
            this.art.pause()
          }
        }
        else if (newVideo.extensionName.type == 'subtitle' || newVideo.extensionName.type == 'torrent' ||
          newVideo.extensionName.type == 'document' || newVideo.extensionName.type == 'archive' ||
          newVideo.extensionName.type == 'image') { // 为其他文件, 未来实现图片预览
          this.playType = 'notVideo'
        }
        else if (newVideo.extensionName.type == 'music') { // 音乐播放
          this.playType = ''
          setTimeout(() => {
            this.playType = 'music'
            setTimeout(() => this.$refs.musicPlayer.play(), 500)
          }, 200); // 准备播放
        } else {
          this.playType = 'notSupport'
          this.art.pause()
        }
      }
    },
    prepareToReportNewView() { // 若某 URL 被持续播放或加载 5 秒钟，则上报播放量
      let sec = 0
      let timer = setInterval(() => {
        if (sec >= 5) { // 成功
          clearInterval(timer)
          this.reporter({ type: 'WebPlayer' })
          return
        }
        sec = sec + 1
        let isPlaying = this.art.playing || this.art.loading.show
        if (!isPlaying) {
          clearInterval(timer)
          console.log('用户打断了当前播放.');
          console.log(sec, 'Successed:', isPlaying, 'Playing:', this.art.playing, 'Loading:', this.art.loading.show);
          return
        }
        console.log(sec, 'Successed:', isPlaying, 'Playing:', this.art.playing, 'Loading:', this.art.loading.show);
      }, 1000)
    },
    forcePlay() { // 强制播放不支持的视频
      this.playType = 'canPlay';
      setTimeout(() => this.art.play(), 200); // 准备播放
      setTimeout(() => this.prepareToReportNewView(), 2000) // 准备上报播放量
      setTimeout(() => this.art.notice.show = '强制播放可能出现黑屏、无字幕、无声等问题!', 300);
      setTimeout(() => this.art.notice.show = '强制播放可能出现黑屏、无字幕、无声等问题!', 700);
      setTimeout(() => this.art.notice.show = '强制播放可能出现黑屏、无字幕、无声等问题!', 1200);
    },
    bytesToSize(bytes) { // 字节体积格式化
      if (bytes === 0) return '0B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + '' + sizes[i];
    }
  },
  mounted() {
    this.art = new Artplayer({
      ...this.option,
      container: this.$refs.artRef,
    })
    this.art.autoHeight = true;
  },
  watch: {
    video(newVideo, oldVideo) {
      this.changeVideo(newVideo)
      console.log('Change Video: ', newVideo);
    }
  }
};
</script>