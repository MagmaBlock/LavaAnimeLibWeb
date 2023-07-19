<script setup>
import { useAnimeStore } from "../../store/Anime.js";
import { useRoute } from "vue-router";
import { watchOnce, useTitle } from "@vueuse/core";
import { inject, watch, onUnmounted, computed, provide, nextTick } from "vue";

import AnimeDataCard from "../../components/Anime/AnimeDataCard.vue";
import AnimeDataCardFake from "../../components/Anime/AnimeDataCardFake.vue";
import LocalPlayers from "../../components/Anime/LocalPlayer/LocalPlayers.vue";
import AnimePlayer from "../../components/Anime/AnimePlayer.vue";
import ContainerMobileFull from "../../components/Layout/PageContainer/ContainerMobileFull.vue";
import RelationAnimes from "../../components/Anime/RelationAnimes.vue";
import DriveSelector from "../../components/Anime/FileList/DriveSelector.vue";
import FileListMain from "../../components/Anime/FileList/FileListMain.vue";
import DevTool from "../../components/Anime/DevTool.vue";
import ErrorMessage from "../../components/Anime/FileList/ErrorMessage.vue";
import NoPlayer from "../../components/Anime/NoPlayer.vue";
import NoBrowserNotice from "../../components/Anime/LocalPlayer/NoBrowserNotice.vue";

const store = useAnimeStore();
const route = useRoute();

const background = inject("background");

const refreshPlayer = async () => {
  store.showArtPlayer = false;
  await nextTick();
  store.showArtPlayer = true;
};
provide("refreshPlayer", refreshPlayer);

const buildPage = () => {
  store.buildPage(route.params.la, route.query.episode);
  watchOnce(
    () => store.state.animeData.isLoading,
    async () => {
      background.value.url = "";
      background.value.on = false;
      await nextTick();
      if (!store.state.animeData.errorCode && store.animeData?.images?.poster) {
        // 启用背景
        background.value.url = store.animeData.images.poster;
        background.value.on = true;
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // 平滑滚动
      });
    }
  );
};

// 监听路由来重建界面
watch(
  () => route.params.la,
  () => {
    if (route.name != "Anime") return; // 排除退出番剧界面的路由变化
    store.$reset();
    buildPage();
  },
  { immediate: true }
);

useTitle(
  computed(() => {
    if (store.state.animeData.isLoading) {
      return "Loading... | 熔岩番剧库 LavaAnimeLib";
    } else if (store.animeData?.title && store.activeFile === undefined) {
      return `${store.animeData?.title} | 熔岩番剧库 LavaAnimeLib`;
    } else if (
      store.animeData?.title &&
      store.activeFile?.parseResult?.episode
    ) {
      return `${store.animeData?.title} 第${store.activeFile.parseResult.episode}话 | 熔岩番剧库 LavaAnimeLib`;
    }
  })
);

onUnmounted(() => {
  background.value.on = false;
});
</script>

<template>
  <ContainerMobileFull>
    <!-- 开发模式视图 -->
    <DevTool class="lg:px-12" v-if="route.query.dev" />
    <!-- 主视图，Grid 布局，仅在 lg 以上可用 -->
    <div
      class="lg:grid lg:grid-cols-3 lg:gap-6 lg:px-12 w-full"
      v-if="!store.state.animeData.errorCode"
    >
      <!-- 左视图 占两列 -->
      <div class="lg:col-span-2">
        <!-- 视频框 -->
        <div class="sm:shadow sm:mb-4 sm:rounded-md overflow-clip">
          <AnimePlayer v-if="store.showArtPlayer" />
          <Transition
            enter-active-class="animate__animated animate__bounceIn"
            leave-active-class="animate__animated absolute animate__fadeOut animate__faster"
          >
            <NoBrowserNotice v-if="store.isNoBrowser" />
          </Transition>
          <NoPlayer v-if="!store.showArtPlayer" />
          <!-- 本地播放器调用 -->
          <LocalPlayers />
        </div>
        <!-- 番剧卡，仅在 sm 以上显示 -->
        <AnimeDataCard
          v-if="!store.state.animeData.isLoading"
          class="hidden sm:block sm:mb-4"
        />
        <AnimeDataCardFake
          v-if="store.state.animeData.isLoading"
          class="hidden sm:block sm:mb-4"
        />
      </div>
      <!-- 右视图 占一列 -->
      <div class="lg:col-span-1">
        <DriveSelector />
        <FileListMain />
        <ErrorMessage />
        <!-- 番剧卡，仅在手机端显示 -->
        <AnimeDataCard
          v-if="!store.state.animeData.isLoading"
          class="sm:hidden"
        />
        <AnimeDataCardFake
          v-if="store.state.animeData.isLoading"
          class="sm:hidden"
        />
        <!-- 关联作品 -->
        <RelationAnimes v-if="!store.state.animeData.isLoading" />
      </div>
    </div>
    <!-- 错误处理视图 -->
    <div
      v-if="store.state.animeData.errorCode == 404"
      class="w-full grid place-content-center mt-16"
    >
      <n-result
        status="404"
        title="404 资源不存在"
        :description="store.state.animeData.errorMessage ?? '未知错误'"
        class="w-fit p-10 rounded"
      />
    </div>
  </ContainerMobileFull>
</template>
