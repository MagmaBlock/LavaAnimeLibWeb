<template>
  <!-- 主卡片组件：显示动画剧集信息 -->
  <NCard embedded :bordered="false" size="small" title="剧集">
    <!-- 卡片头部：包含网格/列表视图切换和排序设置 -->
    <template #header-extra>
      <AnimeEpisodeCardHeaderSettings
        v-model:is-grid="settings.isGrid"
        v-model:sort-asc="settings.sortAsc"
      />
    </template>
    <!-- 标签页组件：分类显示不同类型的剧集 -->
    <NTabs
      v-if="store.mainData?.episodes.length"
      type="segment"
      size="small"
      animated
    >
      <NTabPane
        v-for="type in availableEpisodeTypes"
        :key="type.value"
        :name="type.value"
        :tab="type.label"
      >
        <NScrollbar class="max-h-64">
          <!-- 网格视图 -->
          <div
            v-if="settings.isGrid"
            v-motion="{
              initial: { opacity: 0, y: 10 },
              enter: { opacity: 1, y: 0 },
              duration: 300,
            }"
          >
            <div class="grid grid-cols-6 gap-2">
              <!-- 网格形式的剧集按钮 -->
              <AnimeEpisodeCardEpisodeButtonGrid
                v-for="episode in getSortedEpisodes(type.value)"
                :key="episode.episode.id"
                :episode-display="episode.episode.episodeIndex"
                :name="episode.episode.name"
                :active="episode.episode.id === store.activeEpisodeId"
                :multiple-episodes="episode.mirrorGroupNames.length > 1"
                :not-updated="episode.mirrorGroupNames.length === 0"
                @click="store.activeEpisodeId = episode.episode.id"
              />
            </div>
          </div>
          <!-- 桌面端纵向列表视图 -->
          <div v-if="!settings.isGrid && !isMobile">
            <NFlex
              vertical
              v-motion="{
                initial: { opacity: 0, y: -10 },
                enter: { opacity: 1, y: 0 },
                duration: 300,
              }"
            >
              <AnimeEpisodeCardEpisodeButtonList
                v-for="episode in getSortedEpisodes(type.value)"
                :key="episode.episode.id"
                :episode-display="episode.episode.episodeIndex"
                :name="episode.episode.name"
                :active="episode.episode.id === store.activeEpisodeId"
                :multiple-episodes="episode.mirrorGroupNames.length > 1"
                :not-updated="episode.mirrorGroupNames.length === 0"
                @click="store.activeEpisodeId = episode.episode.id"
              />
            </NFlex>
          </div>
          <!-- 手机端横向列表视图 -->
          <div v-if="!settings.isGrid && isMobile">
            <NScrollbar x-scrollable>
              <div class="flex flex-nowrap gap-2">
                <AnimeEpisodeCardEpisodeButtonMobile
                  v-for="episode in getSortedEpisodes(type.value)"
                  :key="episode.episode.id"
                  :episode-display="episode.episode.episodeIndex"
                  :name="episode.episode.name"
                  :active="episode.episode.id === store.activeEpisodeId"
                  :not-updated="episode.mirrorGroupNames.length === 0"
                  @click="store.activeEpisodeId = episode.episode.id"
                />
              </div>
            </NScrollbar>
          </div>
        </NScrollbar>
      </NTabPane>
    </NTabs>
    <template #action>
      <AnimeEpisodeCardFilesButton />
    </template>
  </NCard>
</template>

<script lang="ts" setup>
import type { AnimeEpisode } from "@prisma/client";
import {
  breakpointsTailwind,
  useBreakpoints,
  useLocalStorage,
} from "@vueuse/core";

const store = useAnimeStore();
const isMobile = useBreakpoints(breakpointsTailwind).smaller("lg");

// 本地存储：保存用户设置
const settings = useLocalStorage("animeEpisodeCardSettings", {
  isGrid: false,
  sortAsc: true,
});

// 剧集类型及对应标签名称
const episodeTypes: { value: AnimeEpisode["type"]; label: string }[] = [
  { value: "Normal", label: "正片" },
  { value: "SP", label: "SP" },
  { value: "OP", label: "OP" },
  { value: "ED", label: "ED" },
  { value: "Other", label: "其他" },
];

// 按类型获取剧集
const getEpisodesByType = (type: AnimeEpisode["type"]) =>
  store.mainData?.episodes.filter((episode) => episode.episode.type === type) ??
  [];

// 计算可用的剧集类型
const availableEpisodeTypes = computed(() =>
  episodeTypes.filter((type) => getEpisodesByType(type.value).length > 0)
);

// 获取并排序指定类型的剧集
const getSortedEpisodes = (type: AnimeEpisode["type"]) => {
  return getEpisodesByType(type).sort((a, b) => {
    if (a.episode.episodeIndex !== b.episode.episodeIndex) {
      return settings.value.sortAsc
        ? a.episode.episodeIndex - b.episode.episodeIndex
        : b.episode.episodeIndex - a.episode.episodeIndex;
    } else {
      return settings.value.sortAsc
        ? (a.episode.episodeIndex ?? 0) - (b.episode.episodeIndex ?? 0)
        : (b.episode.episodeIndex ?? 0) - (a.episode.episodeIndex ?? 0);
    }
  });
};

// 检查是否所有剧集都没有视频文件
const hasAnyEpisodeFiles = computed(
  () =>
    store.mainData?.episodes.some(
      (episode) => episode.mirrorGroupNames.length > 0
    ) ?? false
);
</script>

<style></style>
