<!-- 传入一串 IDs，自动渲染番剧卡片，将自动获取数据-->
<template>
  <!-- Grid 容器  -->
  <div class="grid gap-2 lg:gap-4
  grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <template v-for="anime in data">
      <AnimeCard :id="anime.id" :poster="anime.images.poster" :title="anime.title" :bgmid="anime.bgmId"
        :views="anime.views" :nsfw="anime.type.nsfw" :bdrip="anime.type.bdrip"></AnimeCard>
    </template>
  </div>
</template>

<script>

import { getAnimesData } from '../../../common/api';
import AnimeCard from '../../AnimeCard.vue';
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
    let result = await getAnimesData(this.ids);
    // 根据播放量进行排序
    this.data = result.data.sort(function (a, b) { return b.views - a.views; });
    setTimeout(() => { this.loading.img = false; }, 200);
  },
  methods: {},
  components: { AnimeCard }
}

</script>