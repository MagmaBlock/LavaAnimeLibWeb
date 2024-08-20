<template>
  <NCard title="观看历史" :bordered="false" embedded>
    <!-- Buttons -->
    <template #header-extra>
      <NSpace>
        <NButton
          secondary
          round
          size="small"
          @click="buildPage"
          :disabled="loading"
        >
          <template #icon>
            <Icon
              name="material-symbols:refresh"
              :class="loading ? 'animate-spin' : ''"
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
    <TransitionGroup name="fade">
      <div class="relative" v-if="data.length">
        <!-- 翻页按钮 -->
        <UserHistoryScrollButton
          v-if="!arrivedState.left"
          class="z-10 absolute -left-4 inset-y-0 grid place-items-center"
          direction="left"
          @click="() => scrollAction('left')"
        />
        <UserHistoryScrollButton
          v-if="!arrivedState.right"
          class="z-10 absolute -right-4 inset-y-0 grid place-items-center"
          direction="right"
          @click="() => scrollAction('right')"
        />
        <div class="flex gap-2 overflow-x-auto overflow-y-hidden" ref="scroll">
          <NPopover
            trigger="manual"
            class="animate-bounce"
            :show="justWatched && showPop && index == 0"
            v-for="(history, index) in data"
          >
            <template #trigger>
              <Transition name="fade" mode="out-in">
                <UserHistoryRecordCard
                  :record="history"
                  :key="history.lastReportTime"
                />
              </Transition>
            </template>
            <Transition name="fade">
              <div>✨ 刚刚正在观看</div>
            </Transition>
          </NPopover>
        </div>
      </div>
      <!-- 空状态 -->
      <NEmpty v-if="!data.length && !loading" description="什么也没有看过" />
    </TransitionGroup>
  </NCard>
</template>

<script setup lang="ts">
import { useScroll } from "@vueuse/core";

interface HistoryRecord {
  lastReportTime: string;
  // 添加其他必要的属性
}

const data = ref<HistoryRecord[]>([]);
const showPop = ref(true); // 刚打开界面 50s 内展示提示
const loading = ref(true);

buildPage();
function buildPage(): void {
  data.value = [
    { lastReportTime: new Date().toISOString() },
    { lastReportTime: new Date(Date.now() - 3600000).toISOString() },
    // 添加更多示例数据
  ];
  loading.value = true;
  showPop.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 300);
  setTimeout(() => {
    showPop.value = false;
  }, 5000);
}

// 横向滚动
const scroll = ref(null);
const { x, arrivedState } = useScroll(scroll, { behavior: "smooth" });
const scrollAction = (direction: "left" | "right"): void => {
  if (direction == "right") {
    x.value = x.value + window.innerWidth * (5 / 7);
  } else if (direction == "left") {
    x.value = x.value - window.innerWidth * (5 / 7);
  }
};

// 如果 1 分钟内有最新的历史记录, 此项为 true
const justWatched = computed(() => {
  if (data.value?.length > 0) {
    let lastWatchTime = new Date(data.value[0].lastReportTime);
    let now = new Date();
    let timeInterval = now.getTime() - lastWatchTime.getTime();
    return timeInterval / 1000 <= 60;
  }
  return false;
});

setInterval(() => {
  if (justWatched.value) buildPage();
}, 8000);
</script>
