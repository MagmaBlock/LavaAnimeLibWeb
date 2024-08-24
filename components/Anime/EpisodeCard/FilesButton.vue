<template>
  <ContainerMenuLarge>
    <template #trigger>
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
    </template>
    <AnimeEpisodeCardStorageSelector />
    <AnimeEpisodeCardFileListMenu />
  </ContainerMenuLarge>
</template>

<script lang="ts" setup>
const store = useAnimeStore();
const showDrawer = ref(false);

const buttonDisplay = computed(
  (): {
    text: string;
    icon?: string;
    loading?: boolean;
  } => {
    if (store.episodesStatus === "pending") {
      return {
        text: "正在获取剧集列表",
        loading: true,
      };
    }
    if (store.episodesStatus === "error") {
      return { text: "获取剧集列表失败", icon: "material-symbols:error" };
    }
    if (store.episodesStatus === "success") {
      if (store.fileTempUrlsStatus === "pending") {
        return {
          text: "正在获取视频播放地址",
          loading: true,
        };
      }
      if (store.fileTempUrlsStatus === "error") {
        return { text: "获取视频播放地址失败", icon: "material-symbols:error" };
      }
      if (mirrorGroupCount.value > 0) {
        return {
          text: `当前剧集有 ${mirrorGroupCount.value} 个视频`,
          icon: "material-symbols:folder-open-rounded",
        };
      }
      if (mirrorGroupCount.value === 0) {
        return {
          text: "当前剧集没有视频",
          icon: "material-symbols:error",
        };
      }
    }
    return { text: "未知错误", icon: "material-symbols:error" };
  }
);

// 获取镜像组数量
const mirrorGroupCount = computed(
  () => store.activeEpisode?.mirrorGroups.length ?? 0
);
</script>

<style></style>
