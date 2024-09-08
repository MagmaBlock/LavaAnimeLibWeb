<template>
  <NCard title="观看历史" :bordered="false" embedded>
    <!-- 头部按钮 -->
    <template #header-extra>
      <AnimeViewHistoryHeaderButtons
        :isFullView="fullView"
        :isDeleteMode="isDeleteMode"
        :status="status"
        @toggleDeleteMode="toggleDeleteMode"
        @refreshData="refreshData"
      />
    </template>

    <!-- 历史记录内容 -->
    <div v-if="data && Object.keys(data.history).length">
      <!-- 全视图模式 -->
      <template v-if="fullView">
        <div v-for="(historyInDay, date) in data.history" :key="date">
          <NH3 class="text-lg font-semibold mb-4">{{ formatDate(date) }}</NH3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimeViewHistoryRecord
              v-for="record in historyInDay"
              :key="record.id"
              v-bind="record"
              :isDeleteMode="isDeleteMode"
              @delete="deleteHistory"
            />
          </div>
          <NDivider
            v-if="date !== Object.keys(data.history).slice(-1)[0]"
            class="my-6"
          />
        </div>
        <UniListShowMore
          :onSee="getMoreHistory"
          v-if="currentPage < data.pageCount"
          class="mt-6"
        />
      </template>
      <!-- 简略视图模式 -->
      <template v-else>
        <NScrollbar x-scrollable class="overflow-x-auto">
          <div :class="{'flex gap-4': !vertical, 'flex flex-col gap-4': vertical}" :style="vertical ? '' : 'width: max-content'">
            <AnimeViewHistoryRecord
              v-for="history in flattenHistory(data.history)"
              :key="history.updatedAt.getTime()"
              v-bind="history"
            />
          </div>
        </NScrollbar>
      </template>
    </div>

    <!-- 空状态 -->
    <NEmpty v-else description="什么也没有看过" class="py-12" />
  </NCard>
</template>

<script lang="ts" setup>
import moment from "moment";

const props = defineProps<{
  fullView?: boolean;
  vertical?: boolean;
}>();

const { $client } = useNuxtApp();
const message = useMessage();

// 状态变量
const currentPage = ref(1);
const pageSize = ref(props.fullView ? 40 : 10);
const isDeleteMode = ref(false);

// 获取历史记录数据
const { data, refresh, status } = await useAsyncData(
  "groupedHistory",
  () =>
    $client.common.animeViewHistory.getGroupedHistory.query({
      page: currentPage.value,
      pageSize: pageSize.value,
    }),
  { lazy: true }
);

// 将分组历史记录展平为一维数组
const flattenHistory = (groupedHistory: Record<string, any[]>) => {
  return Object.values(groupedHistory).flat().slice(0, 10);
};

// 刷新数据
const refreshData = () => {
  currentPage.value = 1;
  refresh();
};

// 切换删除模式
const toggleDeleteMode = () => {
  isDeleteMode.value = !isDeleteMode.value;
};

// 获取更多历史记录
const getMoreHistory = async () => {
  if (data.value && currentPage.value < data.value.pageCount) {
    currentPage.value++;
    const newData =
      await $client.common.animeViewHistory.getGroupedHistory.query({
        page: currentPage.value,
        pageSize: pageSize.value,
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
};

// 格式化日期
const formatDate = (date: string | number): string => {
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

  if (date === today) {
    return "今天";
  } else if (date === yesterday) {
    return "昨天";
  } else {
    return moment(date).locale("zh-cn").format("YYYY年MM月DD日");
  }
};

// 删除历史记录
const deleteHistory = async (historyId: string) => {
  try {
    const result = await $client.common.animeViewHistory.removeHistory.mutate({
      historyId,
    });
    if (result.success) {
      refreshData();
      message.success(result.message);
    }
  } catch (error) {
    console.error("删除历史记录失败", error);
    message.error("删除历史记录失败");
  }
};

// 初始化数据
refreshData();
</script>
