<template>
  <n-card title="观看历史" :bordered="false" embedded>
    <!-- Buttons -->
    <template #header-extra>
      <n-space>
        <n-button secondary round size="small" @click="buildPage">
          <template #icon>
            <n-icon>
              <RefreshFilled :class="loading ? 'animate-spin' : ''" />
            </n-icon>
          </template>
        </n-button>
        <RouterLink :to="{ name: 'UserHistory' }">
          <n-button secondary round size="small">
            <template #icon>
              <n-icon> <ChevronRightFilled /> </n-icon>
            </template>
          </n-button>
        </RouterLink>
      </n-space>
    </template>
    <TransitionGroup name="fade" class="relative">
      <!-- 正常数据 -->
      <div class="flex gap-2 overflow-x-scroll" ref="scroll" v-if="data.length">
        <template v-for="(history, index) in data">
          <n-popover
            trigger="manual"
            class="animate-bounce"
            :show="justWatched && showPop && index == 0"
          >
            <template #trigger>
              <Transition name="fade" mode="out-in">
                <HistoryRecord
                  :record="history"
                  :key="history.lastReportTime"
                />
              </Transition>
            </template>
            <Transition name="fade">
              <div>✨ 刚刚正在观看</div>
            </Transition>
          </n-popover>
        </template>
      </div>
      <!-- 翻页按钮 -->
      <ScrollButton
        v-if="!arrivedState.left && data.length"
        class="absolute -left-4 inset-y-0 grid place-items-center"
        direction="left"
        @click="() => scrollAction('left')"
      />
      <ScrollButton
        v-if="!arrivedState.right && data.length"
        class="absolute -right-4 inset-y-0 grid place-items-center"
        direction="right"
        @click="() => scrollAction('right')"
      />
      <!-- 空状态 -->
      <n-empty v-if="!data.length && !loading" description="什么也没有看过" />
    </TransitionGroup>
  </n-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { LavaAnimeAPI } from "../../../common/api";
import HistoryRecord from "./HistoryRecord.vue";
import { useScroll } from "@vueuse/core";
import ScrollButton from "./ScrollButton.vue";
import { ChevronRightFilled, RefreshFilled } from "@vicons/material";

const data = ref([]);
const showPop = ref(true); // 刚打开界面 10s 内展示提示
const loading = ref(true);

buildPage();
async function buildPage() {
  data.value = [];
  loading.value = true;
  await getHistory();

  setTimeout(() => {
    loading.value = false;
  }, 300);
  showPop.value = true;

  setTimeout(() => {
    showPop.value = false;
  }, 8000);
}

// 横向滚动
const scroll = ref(null);
const { x, arrivedState } = useScroll(scroll, { behavior: "smooth" });
const scrollAction = (direction) => {
  if (direction == "right") {
    x.value = x.value + window.innerWidth * (5 / 7);
  } else if (direction == "left") {
    x.value = x.value - window.innerWidth * (5 / 7);
  }
};

async function getHistory(page, pageSize) {
  try {
    let request = await LavaAnimeAPI.post("/v2/anime/history/my", {
      page,
      pageSize,
      withAnimeData: true,
      latestOnly: true,
    });

    if (request.data.code == 200) {
      data.value = request.data.data;
    }
  } catch (error) {}
}

// 如果 1 分钟内有最新的历史记录, 此项为 true
const justWatched = computed(() => {
  if (data.value?.length > 0) {
    let lastWatchTime = new Date(data.value[0].lastReportTime);
    let now = new Date();
    let timeInterval = now.getTime() - lastWatchTime.getTime();
    if (timeInterval / 1000 <= 60) {
      return true;
    } else {
      return false;
    }
  }
});

setInterval(() => {
  if (justWatched.value) getHistory();
}, 8000);
</script>
