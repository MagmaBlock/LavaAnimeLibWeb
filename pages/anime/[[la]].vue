<script setup>
import { watchOnce } from "@vueuse/core";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const store = useAnimeStore();
const background = useBackgroundStore();

const route = useRoute();
const router = useRouter();

const breakpoints = useBreakpoints(breakpointsTailwind);

const currentMobilePage = ref("play");

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

// 集数监控更改路由查询参数
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

// title 显示
useHead({
  title: computed(() => {
    if (store.state.animeData.isLoading) {
      return "加载中...";
    } else if (
      store.animeData?.title &&
      !store.activeFile?.parseResult?.episode
    ) {
      return `${store.animeData?.title}`;
    } else if (
      store.animeData?.title &&
      store.activeFile?.parseResult?.episode
    ) {
      return `${store.animeData?.title} 第${store.activeFile.parseResult?.episode}话`;
    }
  }),
});

/**
 * 背景图相关
 */
// 监听 poster 变化
watch(() => store.animeData?.images?.poster, refreshBackground);
// 监听断点变化
watch(breakpoints.greaterOrEqual("sm"), refreshBackground, { immediate: true });
// 刷新背景
function refreshBackground() {
  if (store.animeData?.images?.poster) {
    if (breakpoints.isGreaterOrEqual("sm") == true) {
      // 启用背景
      background.setBackground(
        store.animeData.images.poster,
        "blur-3xl opacity-50"
      );
    } else {
      background.setEnable(false);
    }
  }
}
// 监听离开界面，解除背景
onUnmounted(() => {
  background.resetBackground();
});

const isMobileOpenDetails = ref(false);
</script>

<template>
  <ContainerPageMobileFull>
    <!-- 开发模式视图 -->
    <DevOnly>
      <AnimeDevTool class="sm:mb-4" />
    </DevOnly>
    <!-- (模态框等) DOM 位置无关组件 -->
    <AnimeAdminTool />
    <!-- 文件浏览器模态框 -->
    <NModal
      v-model:show="store.isFileBrowserOpen"
      preset="card"
      title="链接复制工具"
      style="max-width: 1024px"
    >
      <AnimeFileBrowser />
    </NModal>
    <!-- PC 端主视图，Grid 布局，仅在 lg 以上可用 -->
    <div
      class="grid grid-cols-3 gap-6 w-full"
      v-if="
        store.state.animeData.errorCode == null &&
        breakpoints.greaterOrEqual('lg').value
      "
    >
      <!-- 左视图 占两列 -->
      <NFlex vertical :size="16" class="col-span-2">
        <!-- 视频框 -->
        <div class="rounded-md overflow-clip">
          <AnimePlayer v-if="store.showArtPlayer" />
          <AnimePlayerEmpty v-if="!store.showArtPlayer" />
        </div>
        <!-- 本地播放器调用 -->
        <AnimeCardBasic>
          <div class="flex flex-col gap-2">
            <AnimeSubtitleControl />
            <AnimePlayerActionBar />
          </div>
        </AnimeCardBasic>
        <!-- 番剧卡 -->
        <AnimeMetaCard />
      </NFlex>
      <!-- 右视图 占一列 -->
      <NFlex vertical :size="16" class="col-span-1">
        <AnimeDriveSelector />
        <!-- 番剧公告（V2）临时 -->
        <AnimeNotice />
        <AnimeFileList />
        <AnimeFileErrorDisplay />
        <!-- 关联作品 -->
        <AnimeRelations v-if="!store.state.animeData.isLoading" />
      </NFlex>
    </div>
    <!-- 移动端主视图 -->
    <div
      v-if="
        store.state.animeData.errorCode == null &&
        breakpoints.smaller('lg').value
      "
    >
      <!-- 视频框 -->
      <div class="overflow-clip sm:rounded-md">
        <AnimePlayer v-if="store.showArtPlayer" />
        <AnimePlayerEmpty v-if="!store.showArtPlayer" />
      </div>

      <!-- 番剧公告（V2）临时 -->
      <AnimeNotice />
      <!-- 番剧卡-->
      <AnimeMetaCardMini @open-details="isMobileOpenDetails = true" />
      <NDrawer
        v-model:show="isMobileOpenDetails"
        :default-height="502"
        placement="bottom"
        resizable
      >
        <NDrawerContent
          :closable="true"
          title="详情"
          body-content-style="padding: 0px;"
        >
          <AnimeMetaCard />
        </NDrawerContent>
      </NDrawer>
      <!-- 本地播放器调用 -->
      <AnimeCardBasic>
        <div class="flex flex-col gap-2">
          <AnimeSubtitleControl />
          <AnimePlayerActionBar />
        </div>
      </AnimeCardBasic>
      <AnimeDriveSelector />
      <AnimeFileList />
      <AnimeFileErrorDisplay />
      <!-- 关联作品 -->
      <AnimeRelations v-if="!store.state.animeData.isLoading" />
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
        class="w-fit p-10 rounded-md"
      />
    </div>
  </ContainerPageMobileFull>
</template>
