<template>
  <NCard title="观看历史" :bordered="false" embedded>
    <!-- 按钮 -->
    <template #header-extra>
      <NButtonGroup>
        <NButton
          secondary
          size="small"
          @click="refresh()"
          :loading="status === 'pending'"
        >
          <template #icon>
            <Icon
              name="material-symbols:refresh"
              :class="status === 'pending' ? 'animate-spin' : ''"
            />
          </template>
          刷新
        </NButton>
        <NButton secondary size="small" @click="router.push('/user/history')">
          <template #icon>
            <Icon name="material-symbols:chevron-right" />
          </template>
          详情
        </NButton>
      </NButtonGroup>
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
const router = useRouter();

const { data, refresh, status } = await useAsyncData(
  "recentHistory",
  () => $client.pages.user.recentHistory.query(),
  { lazy: true }
);
</script>
