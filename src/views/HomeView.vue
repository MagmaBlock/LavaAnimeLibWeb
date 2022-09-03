<template>
  <ContainerMobileFull>
    <div class="lg:flex mb-4">
      <HeaderPictures class="lg:basis-1/3 sm:rounded-md lg:mr-4" />
      <BasicCard class="lg:basis-2/3 px-6 py-4">
        <div class="text-xl"> 最近更新 </div>
        <div class="text-sm text-gray-500 mb-2"> 这个还没做 </div>
      </BasicCard>
    </div>
    <AnimeCollection />

  </ContainerMobileFull>
</template>

<script>
import HeaderPictures from "../components/Home/HeaderPictures.vue";
import ContainerMobileFull from "../components/ContainerMobileFull.vue";
import AnimeCollection from "../components/Home/Collection/AnimeCollection.vue";
import BasicCard from "../components/BasicCard.vue";
export default {
  data() {
    return {
      switch: true
    };
  },
  mounted() {
    document.title = '主页 | 熔岩番剧库 LavaAnimeLib'
  },
  components: { HeaderPictures, ContainerMobileFull, AnimeCollection, BasicCard }
}
</script>

<style>
</style>