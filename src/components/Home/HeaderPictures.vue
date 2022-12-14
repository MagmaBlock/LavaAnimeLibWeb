<template>
  <n-carousel show-arrow draggable autoplay class="shadow-lg">
    <template v-for="pic in headerPic">
      <div class="static w-full h-52 sm:h-60">
        <!-- 真图片 -->
        <img class="object-cover w-full min-h-full overflow-hidden" v-lazy="{
          src: pic.pic,
          loading: '/Home/headerPic/LavaAnime.jpg',
          error: '/Home/headerPic/LavaAnime.jpg'
        }">
        <!-- 底部阴影 -->
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/75 "></div>
        <RouterLink v-if="pic.url && !pic.externalUrl" :to="pic.url">
          <HeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
        </RouterLink>
        <a v-else-if="pic.url && pic.externalUrl" :href="pic.url" target="_blank">
          <HeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
        </a>
        <HeaderPictureTitle v-else :title="pic.title" :subtitle="pic.subtitle"></HeaderPictureTitle>
      </div>
    </template>
  </n-carousel>
</template>

<script>
import { LavaAnimeAPI } from '../../common/api';

export default {
  props: {
    customdata: Array
  },
  data() {
    return {
      headerPic: [{
        "pic": "/Home/headerPic/LavaAnime.jpg",
        "url": "",
        "title": "熔岩番剧库 LavaAnimeLib",
        "subtitle": ""
      }],
      display: true
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
    if (this.customdata) {
      this.headerPic = this.customdata
    } else {
      this.headerPic = await this.getData()
    }
  },
  watch: {
    customdata(newData, oldData) {
      this.headerPic = newData
    }
  }
}
</script>