<template>
  <n-carousel show-arrow draggable autoplay class="shadow-lg">
    <template v-for="pic in headerPic">
      <div class="static w-full h-52 sm:h-60">
        <!-- 真图片 -->
        <img class="object-cover w-full min-h-full overflow-hidden" :src="pic.pic">
        <!-- 底部阴影 -->
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/75 "></div>
        <RouterLink v-if="pic.url" :to="pic.url">
          <HeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
        </RouterLink>
        <a v-else-if="pic.externalUrl" :href="pic.externalUrl" target="_blank">
          <HeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
        </a>
        <HeaderPictureTitle v-else :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
      </div>
    </template>
  </n-carousel>
</template>

<script>
import axios from 'axios';
import { LavaAnimeAPI } from '../../common/api';

export default {
  data() {
    return {
      headerPic: [],
      page: 0
    }
  },
  methods: {
    async getData() {
      try {
        let fromAPI = await LavaAnimeAPI.get('/v2/home/header/get');
        if (fromAPI.data.code == 200) return fromAPI.data.data
        else return []
      } catch (error) {
        console.error('请求头图数据失败: ', error)
        return []
      }
    }
  },
  async mounted() {
    this.headerPic = await this.getData()
  }
}
</script>