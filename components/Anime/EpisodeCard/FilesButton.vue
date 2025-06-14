<template>
  <div>
    <NButton
      secondary
      size="small"
      class="w-full"
      @click="showDrawer = true"
      :loading="buttonDisplay.loading"
    >
      <template #icon v-if="buttonDisplay.icon">
        <NIcon><Icon :name="buttonDisplay.icon" /></NIcon>
      </template>
      {{ buttonDisplay.text }}
    </NButton>
    <NDrawer
      v-model:show="showDrawer"
      :placement="isWide ? 'right' : 'bottom'"
      default-width="40%"
      default-height="75%"
      resizable
      :auto-focus="false"
    >
      <NDrawerContent title="存储节点与视频源选择" closable>
        <AnimeStorageSelector />
        <AnimeEpisodeCardFileListMenu class="mt-4" />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const store = useAnimeStore();
const isWide = useBreakpoints(breakpointsTailwind).greater("md");
const showDrawer = ref(false);

const buttonDisplay = computed(
  (): {
    text: string;
    icon?: string;
    loading?: boolean;
  } => {
    if (store.mainDataStatus === "pending") {
      return {
        text: "正在获取剧集列表",
        loading: true,
      };
    }
    if (store.mainDataStatus === "error") {
      return { text: "获取剧集列表失败", icon: "material-symbols:error" };
    }
    if (store.mainDataStatus === "success") {
      if (store.fileTempUrlsStatus === "pending") {
        return {
          text: "正在获取视频播放地址",
          loading: true,
        };
      }
      if (store.fileTempUrlsStatus === "error") {
        return { text: "获取视频播放地址失败", icon: "material-symbols:error" };
      }
      if (similarFilesCount.value > 0) {
        return {
          text: `当前剧集有 ${similarFilesCount.value} 个视频`,
          icon: "material-symbols:folder-open-rounded",
        };
      }
      if (similarFilesCount.value === 0) {
        return {
          text: "当前剧集没有视频",
          icon: "material-symbols:error",
        };
      }
    }
    return { text: "未知错误", icon: "material-symbols:error" };
  },
);

// 获取相似文件组数量
const similarFilesCount = computed(() => {
  const activeEpisode = store.mainData?.episodes.find(
    (ep) => ep.episode.id === store.activeEpisodeId,
  );
  return activeEpisode?.similarFilesIds.length ?? 0;
});
</script>

<style></style>
