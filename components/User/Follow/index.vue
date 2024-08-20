<template>
  <n-card title="我的追番" ref="myFollowRef" :bordered="false" embedded>
    <template #header-extra>
      <n-button
        secondary
        round
        size="small"
        @click="refresh"
        :disabled="loading"
      >
        <template #icon>
          <Icon
            name="material-symbols:refresh"
            :class="loading ? 'animate-spin' : ''"
          />
        </template>
      </n-button>
    </template>
    <n-tabs
      type="segment"
      v-model:value="seletedTab"
      :default-value="2"
      class="max-w-md mb-4"
      ref="tabsRef"
    >
      <n-tab :name="0">
        想看
        <span class="ml-1" v-if="followTotals['0']">
          ({{ followTotals["0"] }})
        </span>
      </n-tab>
      <n-tab :name="1">
        在看
        <span class="ml-1" v-if="followTotals['1']">
          ({{ followTotals["1"] }})
        </span>
      </n-tab>
      <n-tab :name="2">
        看过
        <span class="ml-1" v-if="followTotals['2']">
          ({{ followTotals["2"] }})
        </span>
      </n-tab>
    </n-tabs>
    <div class="overflow-clip">
      <ContainerAnimeCard
        v-if="!fetchFailed"
        :animes="animeList"
        size="full"
        :loading="loading"
        :style="{
          transform: translateVar,
        }"
        class="transition-transform duration-500 ease-out"
      />
      <n-result
        v-else
        class="my-8"
        status="404"
        title="获取失败"
        description="未能连接到人类所在的世界..."
      ></n-result>
    </div>
    <template #action>
      <n-pagination
        v-if="totalPages > 1"
        v-model:page="page"
        :page-count="totalPages"
      />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { refThrottled, useSwipe } from "@vueuse/core";

// 此组件根部第一个 DOM
const myFollowRef = ref<HTMLElement | null>(null);

// 计算每页的尺寸, 以此让分页在所有尺寸的设备上都是刚好满行
let pageSize = 6 * 3; // 六行, 每行三个
function calPageSize(): void {
  let width = window.innerWidth;
  if (width >= 640) pageSize = 5 * 4; // 五行, 每行四个
  if (width >= 768) pageSize = 4 * 5; // 四行, 每行五个
  if (width >= 1024) pageSize = 3 * 7; // 三行, 每行七个
  if (width >= 1280) pageSize = 3 * 8; // 三行, 每行八个
  if (width >= 1536) pageSize = 2 * 10; // 二行, 每行十个
}
calPageSize();

// StatusTab、分页相关数据
const tabsRef = ref(null);
const followTotals = ref({ "0": 10, "1": 20, "2": 30 });
const seletedTab = ref<keyof typeof followTotals.value>("1");
watch(seletedTab, (newTab) => {
  page.value = 1;
  getFollow(newTab, page.value);
});

const page = ref(1);
const totalPages = computed(() => {
  return Math.ceil(followTotals.value[seletedTab.value] / pageSize);
});
watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) getFollow(seletedTab.value, newPage);
});

const loading = ref(false);

// 番剧相关数据
const animeList = ref([
  { title: "示例动画1", cover: "/path/to/cover1.jpg" },
  { title: "示例动画2", cover: "/path/to/cover2.jpg" },
  { title: "示例动画3", cover: "/path/to/cover3.jpg" },
]);
const fetchFailed = ref(false);

function getFollow(
  status: keyof typeof followTotals.value,
  page: number = 1
): void {
  loading.value = true;
  // 模拟获取数据
  setTimeout(() => {
    loading.value = false;
  }, 300);
}

function refresh(): void {
  getFollow(seletedTab.value, page.value);
}

// 监听滑动的相关 ref
const { isSwiping, direction, lengthX } = useSwipe(myFollowRef);
// translateX 的计算
const translateVar = refThrottled(
  computed(() => {
    if (isSwiping.value && ["left", "right"].includes(direction.value)) {
      return `translateX(${-lengthX.value}px)`;
    } else return "";
  }),
  50
);
// 监听滑动并翻页
watch(isSwiping, () => {
  // 滑动行为结束
  if (isSwiping.value == false) {
    if (["left", "right"].includes(direction.value)) {
      if (Math.abs(lengthX.value) >= 180) {
        // 从右往左滑
        if (direction.value == "left") {
          if (seletedTab.value == "2") seletedTab.value = "0";
          else
            seletedTab.value = String(
              Number(seletedTab.value) + 1
            ) as keyof typeof followTotals.value;
        }
        // 从左往右滑
        if (direction.value == "right") {
          if (seletedTab.value == "0") seletedTab.value = "2";
          else
            seletedTab.value = String(
              Number(seletedTab.value) - 1
            ) as keyof typeof followTotals.value;
        }
      }
    }
  }
});

// 启动组件
onMounted(() => {
  getFollow(seletedTab.value, page.value);
});
</script>
