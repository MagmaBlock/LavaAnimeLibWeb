<template>
  <ContainerMobileFull>
    <n-gradient-text type="info" :size="24">
      这里应该有一个主页
    </n-gradient-text>
    <n-gradient-text type="danger" :size="18">
      还没写呢
    </n-gradient-text><br>
    <n-gradient-text type="success" :size="18">
      先定个小目标, <br>收录他
      <n-number-animation :from="0" :to="100000000" /> 部番
    </n-gradient-text><br>
    可以点击下方的 搜索和索引, 看看已经完成的界面~<br>

    <n-switch size="medium" v-model:value="this.switch">
      <template #icon>
        🤔
      </template>
    </n-switch> 哇是{{ this.switch ? '开' : '关' }}关耶
    <div class="lg:flex">
      <div class="lg:basis-1/3">
        <div>
          <HeaderPictures class="max-w-md sm:rounded-md" />
        </div>
      </div>
      <div class="lg:basis-1/3">
        <AnimeCollection class="max-w-md" />
      </div>
    </div>

  </ContainerMobileFull>
</template>

<script>
import HeaderPictures from "../components/Home/HeaderPictures.vue";
import ContainerMobileFull from "../components/ContainerMobileFull.vue";
import AnimeCollection from "../components/Home/Collection/AnimeCollection.vue";
export default {
  data() {
    return {
      switch: true
    };
  },
  mounted() {
    document.title = '主页 | 熔岩番剧库 LavaAnimeLib'
  },
  components: { HeaderPictures, ContainerMobileFull, AnimeCollection }
}
</script>

<style>
</style>