<template>
  <ContainerMobileFull>
    <!-- 浏览器升级提示 -->
    <div
      v-if="notSupport"
      class="bg-gray-200 dark:bg-zinc-800 p-4 text-xs lg:rounded-md lg:mb-4 select-all"
    >
      当前浏览器内核 {{ ua.engine.name }}
      {{ ua.engine.version }} 过旧，界面样式和功能可能发生异常。<br />
      2021 年后的浏览器内核受支持, Chrome / Edge > 84, FireFox > 100, Safari >
      15.6。番剧库最低保证在 Blink 71 能够显示出界面。
    </div>
    <!-- 主页 -->
    <RecentUpdates />
    <AnimeCollection />
  </ContainerMobileFull>
</template>

<script>
import uaParser from "ua-parser-js";

import HeaderPictures from "../components/Home/HeaderPictures.vue";
import ContainerMobileFull from "../components/Layout/PageContainer/ContainerMobileFull.vue";
import AnimeCollection from "../components/Home/Collection/AnimeCollection.vue";
import RecentUpdates from "../components/Home/RecentUpdates.vue";

export default {
  data() {
    return {
      ua: uaParser(),
      notSupport: false,
    };
  },
  mounted() {
    document.title = "主页 | 熔岩番剧库 LavaAnimeLib";
    if (
      (uaParser().engine.name =
        "Blink" && parseInt(uaParser().engine.version) < 84)
    )
      this.notSupport = true;
  },
  components: {
    HeaderPictures,
    ContainerMobileFull,
    AnimeCollection,
    RecentUpdates,
  },
};
</script>

<style></style>
