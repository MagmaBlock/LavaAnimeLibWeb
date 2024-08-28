<template>
  <NCard title="我的追番" ref="myFollowRef" :bordered="false" embedded>
    <template #header-extra>
      <NButton
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
      </NButton>
    </template>
    <NTabs
      type="segment"
      v-model:value="selectedTab"
      :default-value="'Finished'"
      class="max-w-md mb-4"
      ref="tabsRef"
    >
      <NTab name="Plan">
        想看
        <span class="ml-1" v-if="followTotals['Plan']">
          ({{ followTotals["Plan"] }})
        </span>
      </NTab>
      <NTab name="Watching">
        在看
        <span class="ml-1" v-if="followTotals['Watching']">
          ({{ followTotals["Watching"] }})
        </span>
      </NTab>
      <NTab name="Finished">
        看过
        <span class="ml-1" v-if="followTotals['Finished']">
          ({{ followTotals["Finished"] }})
        </span>
      </NTab>
    </NTabs>
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
      <NResult
        v-else
        class="my-8"
        status="404"
        title="获取失败"
        description="未能连接到人类所在的世界..."
      ></NResult>
    </div>
    <template #action>
      <NPagination
        v-if="totalPages > 1"
        v-model:page="page"
        :page-count="totalPages"
      />
    </template>
  </NCard>
</template>

<script lang="ts" setup>
import type { AnimeCollection } from "@prisma/client";
import { refThrottled, useSwipe } from "@vueuse/core";

const { $client } = useNuxtApp();

const myFollowRef = ref<HTMLElement | null>(null);

let pageSize = 6 * 3;
function calPageSize(): void {
  let width = window.innerWidth;
  if (width >= 640) pageSize = 5 * 4;
  if (width >= 768) pageSize = 4 * 5;
  if (width >= 1024) pageSize = 3 * 7;
  if (width >= 1280) pageSize = 3 * 8;
  if (width >= 1536) pageSize = 2 * 10;
}
calPageSize();

const tabsRef = ref(null);
const followTotals = ref({ Plan: 0, Watching: 0, Finished: 0 });
const selectedTab = ref<"Plan" | "Watching" | "Finished">("Watching");
watch(selectedTab, (newTab) => {
  page.value = 1;
  getFollow(newTab);
});

const page = ref(1);
const totalPages = computed(() => {
  return Math.ceil(followTotals.value[selectedTab.value] / pageSize);
});
watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) getFollow(selectedTab.value);
});

const loading = ref(false);
const animeList = ref<AnimeCollection[]>([]);
const fetchFailed = ref(false);

async function getFollow(
  status: "Plan" | "Watching" | "Finished"
): Promise<void> {
  loading.value = true;
  try {
    const result =
      await $client.common.animeCollection.getUserAnimeCollections.query({
        status,
      });
    animeList.value = result;
    followTotals.value[status] = result.length;
    fetchFailed.value = false;
  } catch (error) {
    console.error("获取追番列表失败:", error);
    fetchFailed.value = true;
  } finally {
    loading.value = false;
  }
}

function refresh(): void {
  getFollow(selectedTab.value);
}

const { isSwiping, direction, lengthX } = useSwipe(myFollowRef);
const translateVar = refThrottled(
  computed(() => {
    if (isSwiping.value && ["left", "right"].includes(direction.value)) {
      return `translateX(${-lengthX.value}px)`;
    } else return "";
  }),
  50
);

watch(isSwiping, () => {
  if (isSwiping.value == false) {
    if (["left", "right"].includes(direction.value)) {
      if (Math.abs(lengthX.value) >= 180) {
        const tabOrder = ["Plan", "Watching", "Finished"];
        const currentIndex = tabOrder.indexOf(selectedTab.value);
        if (direction.value == "left") {
          selectedTab.value = tabOrder[(currentIndex + 1) % 3] as
            | "Plan"
            | "Watching"
            | "Finished";
        }
        if (direction.value == "right") {
          selectedTab.value = tabOrder[(currentIndex - 1 + 3) % 3] as
            | "Plan"
            | "Watching"
            | "Finished";
        }
      }
    }
  }
});

onMounted(() => {
  getFollow(selectedTab.value);
});
</script>

<style scoped></style>
