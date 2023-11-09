<script setup>
import { watchOnce, useTitle } from "@vueuse/core";

const store = useAnimeStore();
const background = useBackgroundStore();

const route = useRoute();
const router = useRouter();

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
      if (!store.state.animeData.errorCode && store.animeData?.images?.poster) {
        // 启用背景
        background.setBackground(
          store.animeData.images.poster,
          "blur-3xl opacity-50"
        );
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
    if (route.name != "anime-la") return; // 排除退出番剧界面的路由变化
    store.$reset();
    buildPage();
  },
  { immediate: true }
);

watch(
  () => store.fileData.activeEpisode,
  () => {
    if (store.fileData.activeEpisode) {
      router.replace({
        query: { ...route.query, episode: store.fileData.activeEpisode },
      });
    } else {
      router.replace({ query: { ...route.query, episode: undefined } });
    }
  }
);

useTitle(
  computed(() => {
    if (store.state.animeData.isLoading) {
      return "Loading... | 熔岩番剧库 LavaAnimeLib";
    } else if (
      store.animeData?.title &&
      !store.activeFile?.parseResult?.episode
    ) {
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
  background.resetBackground();
});
</script>

<template>
  <ContainerPageMobileFull>
    <!-- 开发模式视图 -->
    <DevOnly>
      <AnimeDevTool />
    </DevOnly>
    <!-- 主视图，Grid 布局，仅在 lg 以上可用 -->
    <div
      class="lg:grid lg:grid-cols-3 lg:gap-6 w-full"
      v-if="!store.state.animeData.errorCode"
    >
      <!-- 左视图 占两列 -->
      <div class="lg:col-span-2">
        <!-- 视频框 -->
        <div class="sm:mb-4 sm:rounded overflow-clip">
          <AnimePlayer v-if="store.showArtPlayer" />
          <AnimePlayerEmpty v-if="!store.showArtPlayer" />
          <!-- 本地播放器调用 -->
          <AnimePlayerActionBar />
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
        <AnimeDriveSelector />
        <AnimeFileList />
        <AnimeFileErrorDisplay />
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
        <AnimeRelations v-if="!store.state.animeData.isLoading" />
      </div>
    </div>
    <!-- 错误处理视图 -->
    <div
      v-if="store.state.animeData.errorCode == 404"
      class="w-full grid place-content-center mt-16"
    >
      <NResult
        status="404"
        title="404 资源不存在"
        :description="store.state.animeData.errorMessage ?? '未知错误'"
        class="w-fit p-10 rounded"
      />
    </div>
    <!-- (模态框等) DOM 位置无关组件 -->
    <AnimeAdminTool />
  </ContainerPageMobileFull>
</template>
