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
    <NTabs v-if="store.episodes?.length" type="segment" size="small" animated>
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
                :key="episode.id"
                v-bind="getEpisodeProps(episode)"
                @click="store.activeEpisodeId = episode.id"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <NFlex
            v-else
            vertical
            v-motion="{
              initial: { opacity: 0, y: -10 },
              enter: { opacity: 1, y: 0 },
              duration: 300,
            }"
          >
            <AnimeEpisodeCardEpisodeButtonList
              v-for="episode in getSortedEpisodes(type.value)"
              :key="episode.id"
              v-bind="getEpisodeProps(episode)"
              @click="store.activeEpisodeId = episode.id"
            />
          </NFlex>
        </NScrollbar>
      </NTabPane>
    </NTabs>
    <NAlert
      v-if="!hasAnyEpisodeFiles && store.episodeDetailsStatus === 'success'"
      class="mt-2"
      type="info"
    >
      当前动画未找到任何视频，可能还未更新。
    </NAlert>
  </NCard>
</template>

<script lang="ts" setup>
import type { EpisodeType } from "@prisma/client";
import { useLocalStorage } from "@vueuse/core";

const store = useAnimeStore();

// 本地存储：保存用户设置
const settings = useLocalStorage("animeEpisodeCardSettings", {
  isGrid: false,
  sortAsc: true,
});

// 剧集类型及对应标签名称
const episodeTypes: { value: EpisodeType; label: string }[] = [
  { value: "Normal", label: "正片" },
  { value: "SP", label: "SP" },
  { value: "OP", label: "OP" },
  { value: "ED", label: "ED" },
  { value: "Other", label: "其他" },
];

// 按类型获取剧集
const getEpisodesByType = (type: EpisodeType) =>
  store.episodes?.filter((episode) => episode.type === type) ?? [];

// 计算可用的剧集类型
const availableEpisodeTypes = computed(() =>
  episodeTypes.filter((type) => getEpisodesByType(type.value).length > 0)
);

// 获取并排序指定类型的剧集
const getSortedEpisodes = (type: EpisodeType) => {
  return getEpisodesByType(type).sort((a, b) => {
    if (a.episodeIndex !== b.episodeIndex) {
      return settings.value.sortAsc
        ? a.episodeIndex - b.episodeIndex
        : b.episodeIndex - a.episodeIndex;
    } else {
      return settings.value.sortAsc
        ? a.episodeDisplay - b.episodeDisplay
        : b.episodeDisplay - a.episodeDisplay;
    }
  });
};

// 获取剧集属性
const getEpisodeProps = (episode: any) => ({
  episodeDisplay: episode.episodeDisplay,
  name: episode.name,
  active: episode.id === store.activeEpisodeId,
  multipleEpisodes: episode.files.length > 1,
  notUpdated: episode.files.length === 0,
});

// 检查是否所有剧集都没有视频文件
const hasAnyEpisodeFiles = computed(
  () => store.episodes?.some((episode) => episode.files.length > 0) ?? false
);
</script>

<style></style>
