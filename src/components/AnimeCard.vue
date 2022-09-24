<script>
import { ref } from 'vue';

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
      more: ref('')
    }
  },
  mounted() { }
}
</script>

<template>
  <!-- 卡片 -->
  <div class="relative transition-all ease-out box-content
      rounded-md overflow-hidden hover:border-2 hover:border-blue-600 border-2 border-white/0 hover:scale-[1.03]
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
      <div class="flex h-full">
        <div class="basis-3/4 grid content-center pl-3">
          <div class="text-[13px]"><i class="bi bi-play-btn"></i> {{ views }}</div>
          <!-- <div><i class="bi bi-play-btn"></i> {{ views > 999 ? (views / 1000).toFixed(2)  + 'k': views}}</div> -->
        </div>
        <div class="basis-1/4 grid place-items-center">
          <!-- 菜单 -->
          <n-popover trigger="click" :show-arrow="false" raw>
            <template #trigger>
              <div class="hover:bg-black/20 p-1 rounded cursor-pointer">
                <i class="bi bi-list text-gray-700"></i>
              </div>
            </template>
            <div class="grid grid-cols-1 p-1 bg-white rounded">
              <div class="hover:bg-black/20 rounded flex flex-nowrap h-7 cursor-pointer">
                <div class="grid place-items-center w-8">
                  <i class="bi bi-star"></i>
                </div>
                <div class="grid place-items-center mr-2">
                  添加到浏览器收藏 (未完成)
                </div>
              </div>
              <a v-if="parseInt(bgmid)" :href="'https://bgm.tv/subject/' + bgmid" target="_blank"
                class="hover:bg-black/20 rounded flex flex-nowrap h-7">
                <div class="grid place-items-center w-8">
                  <i class="bi bi-box-arrow-up-right"></i>
                </div>
                <div class="grid place-items-center mr-2">
                  去番组计划查看资料
                </div>
              </a>
            </div>
          </n-popover>
        </div>
      </div>
    </div>
  </div>
</template>