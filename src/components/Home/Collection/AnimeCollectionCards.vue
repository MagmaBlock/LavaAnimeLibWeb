<!-- 传入一串 IDs，自动渲染番剧卡片，将自动获取数据-->
<template>
  <!-- Grid 容器  -->
  <div class="my-2 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <!-- 卡片容器 -->
    <div class="relative w-full rounded-md overflow-hidden
        ease-in transition-all hover:shadow-lg hover:border-2 hover:scale-105
        hover:bg-blue-100 hover:border-blue-600
        cursor-pointer" v-for="anime in data" @click="this.$router.push('/anime/' + anime.id)">
      <!-- 图片 -->
      <div class="overflow-hidden aspect-w-2 aspect-h-3">
        <!-- 真图片 -->
        <img :src="anime.images.poster" alt="Poster" class="object-cover ease-in transition"
          :class="loading.img ? 'h-0 opacity-0':''">
        <!-- 图片骨架 -->
        <div class="w-full bg-gray-300 animate-pulse" v-if="loading.img"></div>
      </div>
      <!-- 底部信息 -->
      <div class="absolute inset-x-0 bottom-0 grid items-end
            px-3 py-3 h-24
            bg-gradient-to-b from-transparent to-black/75 md:to-black text-white">
        <div class="text-[13px] leading-[16px]  break-all">
          <n-ellipsis :line-clamp="2" expand-trigger="hover">
            {{ anime.title }}
          </n-ellipsis>
        </div>
        <!-- <div class="text-xs">
          <i class="bi bi-play-btn"></i> {{ anime.views }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>

import { LavaAnimeAPI } from '../../../common/api';
export default {
  props: {
    ids: Array
  },
  data() {
    return {
      data: [],
      loading: {
        img: true
      }
    };
  },
  async mounted() {
    let result = await this.getAnimesData(this.ids);
    this.data = result.data.sort(function (a, b) { return b.views - a.views });
    setTimeout(() => { this.loading.img = false }, 200)
  },
  methods: {
    async getAnimesData(array) {
      try {
        let data = (await LavaAnimeAPI.post("/v2/anime/get", { ids: array })).data;
        return data;
      }
      catch (error) {
        console.error(error);
      }
    }
  }
}

</script>