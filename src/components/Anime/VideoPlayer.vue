<template>
  <div class="w-full h-fit sm:rounded-md select-none relative">
    <div class="w-full h-0 pb-[56.25%] bg-black sm:rounded-md"></div>
    <!-- 链接为空时 -->
    <div class="absolute top-0 w-full h-full text-white grid place-items-center" :class="url ? 'hidden' : ''">
      请选择集数后播放
    </div>
    <div ref="artRef" class="absolute top-0 w-full h-full la-art-player" :class="url ? '' : 'hidden'"></div>
  </div>
</template>

<style>
/* 在非手机上为视频播放器增加圆角 */
@media (min-width: 640px) {
  .la-art-player>div>video {
    border-radius: 0.375rem
  }

  .la-art-player>div>div {
    border-radius: 0.375rem
  }

  .la-art-player>div {
    border-radius: 0.375rem
  }
}

/* 在全屏时不使用圆角 */
.la-art-player:fullscreen>div>video {
  border-radius: 0px
}

.la-art-player:fullscreen>div>div {
  border-radius: 0px
}

.la-art-player:fullscreen>div {
  border-radius: 0px
}

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
      art: null,
      option: {
        url: this.url,
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
      }
    };
  },
  props: {
    url: String,
    reporter: Function
  },
  methods: {
    changeUrl(newUrl) {
      this.art.pause()
      this.art.notice.show = '正在切换...'
      this.art.url = newUrl
      setTimeout(() => this.art.play(), 500);
      setTimeout(() => this.prepareToReportNewView(), 1000)
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
          return
        }
        console.log(sec, 'Successed:', isPlaying, 'Playing:', this.art.playing, 'Loading:', this.art.loading.show);
      }, 1000)
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
    url(newUrl, oldUrl) {
      this.changeUrl(newUrl)
    }
  }
};
</script>