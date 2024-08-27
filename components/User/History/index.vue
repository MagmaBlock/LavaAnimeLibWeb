<template>
  <NCard title="观看历史" :bordered="false" embedded>
    <!-- 按钮 -->
    <template #header-extra>
      <NSpace>
        <NButton
          secondary
          round
          size="small"
          @click="refresh()"
          :disabled="status === 'pending'"
        >
          <template #icon>
            <Icon
              name="material-symbols:refresh"
              :class="status === 'pending' ? 'animate-spin' : ''"
            />
          </template>
        </NButton>
        <RouterLink to="/user/history">
          <NButton secondary round size="small">
            <template #icon>
              <Icon name="material-symbols:chevron-right" />
            </template>
          </NButton>
        </RouterLink>
      </NSpace>
    </template>
    <!-- 正常数据 -->
    <div v-if="data && data.length && status === 'success'" key="normal-data">
      <NScrollbar x-scrollable ref="scrollbar">
        <div class="flex gap-2" style="width: max-content">
          <UserHistoryRecordCard
            v-for="history in data"
            :key="history.updatedAt.getTime()"
            :animeId="history.animeId"
            :name="history.name"
            :image-url="history.imageUrl"
            :episodeType="history.episode?.type"
            :episodeDisplay="history.episode?.episodeDisplay"
            :currentTime="history.currentTime"
            :totalTime="history.totalTime"
            :watchMethod="history.watchMethod"
            :updatedAt="history.updatedAt"
          />
        </div>
      </NScrollbar>
    </div>
    <!-- 空状态 -->
    <NEmpty
      v-if="(!data || !data.length) && status === 'success'"
      description="什么也没有看过"
    />
    <!-- 加载状态 -->
    <NSkeleton v-if="status === 'pending'" :height="81" :sharp="false" />
  </NCard>
</template>

<script setup lang="ts">
import { NScrollbar } from "naive-ui";

const { $client } = useNuxtApp();

const { data, refresh, status } = await useAsyncData(
  "recentHistory",
  () => $client.pages.user.recentHistory.query(),
  { lazy: true }
);
</script>
