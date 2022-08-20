<template>
  <div class="bg-black w-full min-h-[200px] aspect-video sm:rounded-md select-none">
    <!-- 链接为空时 -->
    <div class="w-full h-full grid grid-cols-1 content-center" v-if="!url">
      <div class="text-white text-center">请在右侧选择集数播放</div>
    </div>
    <div ref="artRef" class="la-art-player w-full h-full" :class="url ? '' : 'hidden'"></div>
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
      display: '',
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
      },
    };
  },
  props: {
    url: String
  },
  methods: {
    changeUrl(newUrl) {
      this.art.pause()
      this.art.notice.show = '正在切换...'
      this.art.url = newUrl
      setTimeout(() => {
        this.art.play()
      }, 500);
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