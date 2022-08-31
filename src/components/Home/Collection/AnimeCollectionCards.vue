<!-- 传入一串 IDs，自动调用 AnimeCard 并打印。 内部不包含任何容器，纯 AnimeCard 直接返回给上层 -->
<!-- 最好在上层使用 Grid 之类的容器包裹住 -->
<template>
  <div v-if="!loading" class="flex flex-wrap">
    <div class="basis-1/2" v-for="anime in data">
      <!-- 卡片 -->
      <div
        class="flex static bg-slate-100 hover:bg-slate-200 focus:bg-slate-300 ease-in transition rounded w-full h-16">
        <!-- <img :src="anime.images.poster" alt="Poster" class="absolute"> -->
        <div class="p-3">
          <div class="text-sm ">{{ anime.title }}</div>
          <div class=""><i class="bi bi-play-btn"></i> {{ anime.views }} 次播放</div>
        </div>
      </div>
    </div>
    <!-- <AnimeCard :id="anime.id" :poster="anime.images.poster" :title="anime.title" :bgmid="anime.bgmId"
      :views="anime.views" :nsfw="anime.type.nsfw" :bdrip="anime.type.bdrip"  /> -->
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
    this.data = result.data;
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