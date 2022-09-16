<script>

export default {
  props: {
    id: [String, Number],
    poster: { type: String },
    title: { type: String, default: '' },
    bgmid: [String, Number],
    views: { type: [String, Number], default: 0 },
    nsfw: { type: Boolean, default: false },
    bdrip: { type: Boolean, default: false },
    fake: { type: Boolean, default: false }
  },
  methods: {
    goToThisAnime(id) {
      if (parseInt(id)) this.$router.push('/anime/' + id)
      else return
    }
  },
  data() {
    return {
      blurBackground: 'https://bangumi-app-img.5t5.top/assets/no-bgm-bg.jpg/bg'
    }
  },
  mounted() {
  }
}
</script>

<template>
  <!-- 卡片 -->
  <div class="relative transition-all ease-out box-content m-1
      rounded-md overflow-hidden hover:border-2 hover:border-blue-600 border-2 border-white hover:scale-105
      hover:shadow-lg">
    <div class="absolute bg-gray-100 w-full h-full"></div>

    <!-- 上半：海报 + 标题 -->
    <div class="relative overflow-hidden cursor-pointer" @click="goToThisAnime(id)">
      <!-- 图片容器 -->
      <div class="overflow-hidden aspect-w-2 aspect-h-3">
        <img v-lazy="{ src: poster, loading:'https://bangumi-app-img.5t5.top/assets/PosterLoading.jpg', 
        error: 'https://bangumi-app-img.5t5.top/assets/noposter.png' }" class="absolute object-cover" alt="封面图片">
      </div>
      <!-- 标题 -->
      <div class="absolute inset-x-0 bottom-0 grid items-end
            px-3 py-3 h-24
            bg-gradient-to-b from-transparent to-black/75 text-white text-[13px] break-all">
        <n-ellipsis :line-clamp="2" expand-trigger="hover">
          {{ title || '...' }}
          <!-- Special Tags -->
          <div v-if="bdrip" class="inline-block bg-blue-400 bg-opacity-50 backdrop-blur-sm
            text-xs font-medium px-1.5 ml-0.5 rounded-sm">
            BD
          </div>
          <div v-if="nsfw" class="inline-block bg-yellow-300 bg-opacity-50 backdrop-blur-sm
            text-xs font-medium px-1.5 ml-0.5 rounded-sm">
            NSFW
          </div>
        </n-ellipsis>
      </div>
    </div>

    <!-- 信息区 -->
    <div class="relative h-8">
      <!-- 模糊背景 -->
      <!-- <div class="absolute bottom-0 -z-10">
        <img v-lazy="{ src: poster || blurBackground }" class="w-full h-full object-cover" alt="背景">
      </div> -->
      <div class="flex h-full">
        <div class="basis-2/3 grid content-center pl-3">
          <div><i class="bi bi-play-btn"></i> {{ views }}</div>
        </div>
        <div class="basis-1/3 grid place-items-center">
          <a v-if="parseInt(bgmid)" class="hover:bg-black/20 px-3 py-1 rounded"
            :href="'https://bgm.tv/subject/' + bgmid" target="_blank">
            <i class="bi bi-link-45deg"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>