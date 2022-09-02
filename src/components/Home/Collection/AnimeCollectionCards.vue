<!-- 传入一串 IDs，自动调用 AnimeCard 并打印。 内部不包含任何容器，纯 AnimeCard 直接返回给上层 -->
<!-- 最好在上层使用 Grid 之类的容器包裹住 -->
<template>
  <div v-if="!loading" class="my-4 grid gap-x-4 gap-y-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    <template v-for="anime in data">
      <!-- 卡片 -->
      <RouterLink :to="'/anime/' + anime.id">
        <div class="relative w-full ease-in transition hover:shadow-lg rounded-md">
          <div class="-z-10 h-16 overflow-hidden grid place-content-center rounded-t-md">
            <img :src="anime.images.poster" alt="Poster" class="w-full">
          </div>
          <div class="px-4 py-2 bg-gray-100 rounded-b-md">
            <div class="whitespace-nowrap truncate"> {{ anime.title }} </div>
            <div class="text-xs text-gray-600"><i class="bi bi-play-btn"></i> {{ anime.views }} 次播放</div>
          </div>
        </div>
      </RouterLink>
    </template>
  </div>
</template>

<script>

import { LavaAnimeAPI } from '../../../common/api';
import AnimeCard from '../../AnimeCard.vue';
export default {
  props: {
    ids: Array
  },
  data() {
    return {
      data: null,
      loading: true
    };
  },
  async mounted() {
    let result = await this.getAnimesData(this.ids);
    this.data = result.data.sort(function (a, b) { return b.views - a.views });
    this.loading = false
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
    },
  },
  components: { AnimeCard }
}

</script>