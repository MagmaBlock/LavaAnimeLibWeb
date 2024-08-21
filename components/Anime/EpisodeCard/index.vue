<template>
  <!-- 主卡片组件，用于显示动画剧集信息 -->
  <NCard embedded :bordered="false" size="small" title="剧集">
    <!-- 卡片头部额外内容，包含网格/列表视图切换和排序设置 -->
    <template #header-extra>
      <HeaderSettings
        :is-grid="settings.isGrid"
        :sort-asc="settings.sortAsc"
        @toggle-grid="settings.isGrid = !settings.isGrid"
        @toggle-sort="settings.sortAsc = !settings.sortAsc"
      />
    </template>
    <!-- 使用标签页组件来分类显示不同类型的剧集 -->
    <NTabs type="segment" size="small" animated>
      <NTabPane
        v-for="type in availableEpisodeTypes"
        :key="type"
        :name="type"
        :tab="getTabName(type)"
      >
        <NScrollbar class="max-h-64">
          <!-- 网格视图 -->
          <div
            v-if="settings.isGrid"
            v-motion
            :initial="{ opacity: 0, y: 10 }"
            :enter="{ opacity: 1, y: 0 }"
            :duration="300"
          >
            <div class="flex flex-wrap gap-x-2 gap-y-2">
              <!-- 网格形式的剧集按钮 -->
              <AnimeEpisodeCardEpisodeButtonGrid
                v-for="episode in getEpisodesByType(type)"
                :key="episode.id"
                :episodeDisplay="episode.episodeDisplay"
                :active="episode.id === activeEpisodeId"
                @click="setActiveEpisode(episode.id)"
                :multipleEpisodes="episode.files.length > 1"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <NFlex
            vertical
            v-else
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0 }"
            :duration="300"
          >
            <template
              v-for="episode in getEpisodesByType(type)"
              :key="episode.id"
            >
              <!-- 列表形式的剧集按钮 -->
              <AnimeEpisodeCardEpisodeButtonList
                :episodeDisplay="episode.episodeDisplay"
                :name="episode.name"
                :active="episode.id === activeEpisodeId"
                @click="setActiveEpisode(episode.id)"
              />
            </template>
          </NFlex>
        </NScrollbar>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<script lang="ts" setup>
import type { EpisodeType } from "@prisma/client";
import { useLocalStorage } from "@vueuse/core";
import HeaderSettings from "./HeaderSettings.vue";

// 定义组件属性
const props = defineProps<{
  animeId: number;
}>();

// 定义事件
const emit = defineEmits<{
  (e: "episodeChange", episodeId: number | null): void;
}>();

// 获取 Trpc
const { $client } = useNuxtApp();

// 使用本地存储保存用户设置
const settings = useLocalStorage("animeEpisodeCardSettings", {
  isGrid: false,
  sortAsc: true,
});

// 定义剧集类型
const episodeTypes: EpisodeType[] = ["Normal", "SP", "OP", "ED", "Other"];

// 获取标签页名称的函数
const getTabName = (type: EpisodeType) => {
  const tabNames = {
    Normal: "正片",
    SP: "SP",
    OP: "OP",
    ED: "ED",
    Other: "其他",
  };
  return tabNames[type] || type;
};

// 异步获取动画剧集数据
const { data: episodes, status } = await useAsyncData("animeEpisodes", () =>
  $client.pages.anime.getAnimeEpisodes.query({ animeId: props.animeId })
);

// 当前选中的剧集ID
const activeEpisodeId = ref<number | null>(null);

// 设置当前选中的剧集
const setActiveEpisode = (episodeId: number) => {
  activeEpisodeId.value = episodeId;
  emit("episodeChange", episodeId);
};

// 监听 activeEpisodeId 的变化
watch(activeEpisodeId, (newValue) => {
  emit("episodeChange", newValue);
});

// 根据类型获取并排序剧集
const getEpisodesByType = (type: EpisodeType) => {
  return (
    episodes.value
      ?.filter((episode) => episode.type === type)
      .sort((a, b) =>
        settings.value.sortAsc
          ? a.episodeIndex - b.episodeIndex
          : b.episodeIndex - a.episodeIndex
      ) || []
  );
};

// 计算可用的剧集类型
const availableEpisodeTypes = computed(() => {
  return episodeTypes.filter((type) => getEpisodesByType(type).length > 0);
});
</script>

<style></style>
