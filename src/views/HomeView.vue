<template>
  <ContainerMobileFull>
    <div v-if="notSupport" class="bg-gray-200 p-4 text-xs lg:rounded-md lg:mb-4">
      您当前使用的浏览器内核 {{ ua.engine.name }} {{ ua.engine.version }} 过于老旧，可能部分功能将无法正常使用. <br>
      使用 2021 年后的浏览器以获得最佳体验, Chrome / Edge > 89, FireFox > 100, Safari > 15.6.
    </div>
    <div class="lg:flex mb-4">
      <HeaderPictures class="lg:basis-1/3 sm:rounded-md lg:mr-4" />
      <div class="lg:basis-2/3 px-6 py-4 bg-gray-50 rounded-md hidden lg:block">
        <div class="text-xl">最近更新</div>
        <div class="text-sm text-gray-500 mb-2">预留</div>
      </div>
    </div>
    <NoticeCard />
    <AnimeCollection />

  </ContainerMobileFull>
</template>

<script>
import uaParser from 'ua-parser-js';

import HeaderPictures from "../components/Home/HeaderPictures.vue";
import ContainerMobileFull from "../components/ContainerMobileFull.vue";
import AnimeCollection from "../components/Home/Collection/AnimeCollection.vue";
import BasicCard from "../components/BasicCard.vue";
import NoticeCard from '../components/Home/NoticeCard.vue';
export default {
  data() {
    return {
      ua: uaParser(),
      notSupport: false
    };
  },
  mounted() {
    document.title = '主页 | 熔岩番剧库 LavaAnimeLib'
    if (uaParser().engine.name = 'Blink' && parseInt(uaParser().engine.version) < 88) this.notSupport = true
  },
  components: { HeaderPictures, ContainerMobileFull, AnimeCollection, BasicCard, NoticeCard }
}
</script>

<style>

</style>