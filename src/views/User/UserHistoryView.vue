<template>
  <ContainerMobileFull>
    <TopNav class="sm:mb-8" />
    <n-card title="观看历史" :bordered="false" embedded>
      <template #header-extra>
        <n-button secondary round size="small" @click="buildPage">
          <template #icon>
            <n-icon>
              <RefreshFilled :class="loading ? 'animate-spin' : ''" />
            </n-icon>
          </template>
        </n-button>
      </template>
      <Transition name="fade" class="relative">
        <!-- 正常数据 -->
        <div v-if="data.length">
          <template v-for="(historyInDay, index) in groupedData">
            <n-h3>{{ historyInDay.date }}</n-h3>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <HistoryRecord
                :record="record"
                v-for="record in historyInDay.records"
              />
            </div>
            <n-divider v-if="index + 1 != groupedData.length" />
            <ShowMoreButton :onSee="getMoreHistory" v-else-if="!ended" />
          </template>
        </div>
      </Transition>
      <!-- 空状态 -->
      <n-empty
        v-if="!data.length && !loading"
        description="什么也没有看过"
      ></n-empty>
    </n-card>
    <n-back-top :bottom="120" />
  </ContainerMobileFull>
</template>

<script setup>
import { ref, computed } from "vue";
import { LavaAnimeAPI } from "../../common/api";
import HistoryRecord from "../../components/My/ViewHistory/HistoryRecord.vue";
import dayjs from "dayjs";
import { RefreshFilled } from "@vicons/material";

const data = ref([]);
const currentPage = ref(1);
const ended = ref(false);
const loading = ref(true);

const groupedData = computed(() => {
  let groupedData = {};

  // Assuming `data` is your array of records
  data.value.forEach((record) => {
    let date = dayjs(record.lastReportTime).format("YYYY-MM-DD");
    if (dayjs().format("YYYY-MM-DD") == date) {
      date = "今天";
    } else if (dayjs().subtract(1, "day").format("YYYY-MM-DD") == date) {
      date = "昨天";
    }

    // Check if the date key already exists in groupedData
    if (!groupedData[date]) {
      groupedData[date] = [record];
    } else {
      groupedData[date].push(record);
    }
  });

  // Convert groupedData into an array of objects for easier rendering
  const groupedArray = Object.keys(groupedData).map((date) => {
    return { date, records: groupedData[date] };
  });

  return groupedArray;
});

async function getHistory(page, pageSize) {
  try {
    let request = await LavaAnimeAPI.post("/v2/anime/history/my", {
      page,
      pageSize: 40,
      withAnimeData: true,
    });

    if (request.data.code == 200) {
      return request.data.data;
    }
  } catch (error) {}
}

async function getMoreHistory() {
  let result = await getHistory(++currentPage.value);
  if (!result?.length) ended.value = true;
  data.value = data.value.concat(result);
}

async function buildPage() {
  data.value = [];
  currentPage.value = 1;
  ended.value = false;
  loading.value = true;

  data.value = await getHistory(currentPage.value);
  loading.value = false;
}
buildPage();
</script>
