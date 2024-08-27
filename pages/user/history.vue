<template>
  <ContainerPageMobileFull>
    <template #head>
      <NavBarTopNav />
    </template>
    <NCard title="观看历史" :bordered="false" embedded>
      <template #header-extra>
        <NButtonGroup>
          <NButton secondary size="small" @click="toggleDeleteMode">
            <template #icon>
              <Icon
                :name="
                  isDeleteMode
                    ? 'material-symbols:exit-to-app'
                    : 'material-symbols:delete'
                "
              />
            </template>
            {{ isDeleteMode ? "退出删除" : "删除模式" }}
          </NButton>
          <NButton
            secondary
            size="small"
            @click="refreshData"
            :loading="status === 'pending'"
          >
            <template #icon>
              <Icon name="material-symbols:refresh" />
            </template>
            刷新
          </NButton>
        </NButtonGroup>
      </template>
      <Transition name="fade" class="relative">
        <!-- 正常数据 -->
        <div v-if="data && Object.keys(data.history).length">
          <template v-for="(historyInDay, date) in data.history" :key="date">
            <NH3>{{ formatDate(date) }}</NH3>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="record in historyInDay"
                :key="record.id"
                class="relative"
              >
                <UserHistoryRecordCard
                  :animeId="record.animeId"
                  :name="record.name"
                  :imageUrl="record.imageUrl"
                  :episodeType="record.episode?.type"
                  :episodeDisplay="record.episode?.episodeDisplay"
                  :currentTime="record.currentTime"
                  :totalTime="record.totalTime"
                  :watchMethod="record.watchMethod"
                  :updatedAt="record.updatedAt"
                />
                <NButton
                  v-if="isDeleteMode"
                  type="error"
                  secondary
                  class="absolute bottom-0 right-0"
                  @click="deleteHistory(record.id)"
                >
                  <template #icon>
                    <Icon name="material-symbols:delete" />
                  </template>
                </NButton>
              </div>
            </div>
            <NDivider v-if="date !== Object.keys(data.history).slice(-1)[0]" />
          </template>
          <UniListShowMore
            :onSee="getMoreHistory"
            v-if="currentPage < data.pageCount"
          />
        </div>
      </Transition>
      <!-- 空状态 -->
      <NEmpty
        v-if="!data || !Object.keys(data.history).length"
        description="什么也没有看过"
      />
    </NCard>
    <NBackTop :bottom="120" />
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
useHead({ title: "观看历史" });

import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import "moment/dist/locale/zh-cn";

const { $client } = useNuxtApp();
const message = useMessage();

const currentPage = ref(1);
const pageSize = 40;
const isDeleteMode = ref(false);

const { data, refresh, status } = await useAsyncData(
  "detailedHistory",
  () =>
    $client.pages.user.history.getDetailedHistory.query({
      page: currentPage.value,
      pageSize,
    }),
  { lazy: true }
);

function refreshData() {
  currentPage.value = 1;
  refresh();
}

function toggleDeleteMode() {
  isDeleteMode.value = !isDeleteMode.value;
}

async function getMoreHistory() {
  if (data.value && currentPage.value < data.value.pageCount) {
    currentPage.value++;
    const newData = await $client.pages.user.history.getDetailedHistory.query({
      page: currentPage.value,
      pageSize,
    });
    if (newData && newData.history) {
      Object.keys(newData.history).forEach((date) => {
        if (data.value!.history[date]) {
          data.value!.history[date].push(...newData.history[date]);
        } else {
          data.value!.history[date] = newData.history[date];
        }
      });
    }
  }
}

function formatDate(date: string | number): string {
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

  if (date === today) {
    return "今天";
  } else if (date === yesterday) {
    return "昨天";
  } else {
    return moment(date).locale("zh-cn").format("YYYY年MM月DD日");
  }
}

async function deleteHistory(historyId: string) {
  try {
    const result = await $client.pages.user.history.removeHistory.mutate({
      historyId,
    });
    if (result.success) {
      refreshData();
      message.success(result.message);
    }
  } catch (error) {
    console.error("删除历史记录失败", error);
    if (error instanceof TRPCError || error instanceof TRPCClientError) {
      return message.error(error.message);
    }
    message.error("删除历史记录失败");
  }
}

refreshData();
</script>
