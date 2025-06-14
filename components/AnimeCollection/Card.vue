<template>
  <NCard title="我的追番" ref="myFollowRef" :bordered="false" embedded>
    <template #header-extra>
      <NButton
        secondary
        size="small"
        @click="collections.execute()"
        :loading="collections.status.value === 'pending'"
      >
        <template #icon>
          <Icon name="material-symbols:refresh" />
        </template>
        刷新
      </NButton>
    </template>
    <NTabs type="segment" v-model:value="selectedTab" class="max-w-xl mb-4">
      <NTab name="Plan">
        想看
        <span class="ml-1" v-if="collectionsCount.data.value">
          ({{ collectionsCount.data.value["Plan"] }})
        </span>
      </NTab>
      <NTab name="Watching">
        在看
        <span class="ml-1" v-if="collectionsCount.data.value">
          ({{ collectionsCount.data.value["Watching"] }})
        </span>
      </NTab>
      <NTab name="Finished">
        看过
        <span class="ml-1" v-if="collectionsCount.data.value">
          ({{ collectionsCount.data.value["Finished"] }})
        </span>
      </NTab>
    </NTabs>
    <div ref="containerRef">
      <AnimeCardContainer
        size="full"
        v-if="collections.data.value?.items?.length"
      >
        <AnimeCard
          v-for="anime in collections.data.value.items"
          :key="anime.collection.id"
          :id="anime.anime.id"
          :name="anime.anime.name"
          :bdrip="anime.anime.bdrip"
          :nsfw="anime.anime.nsfw"
          :views="anime.anime.views"
          :image="anime.anime.poster ?? undefined"
        />
      </AnimeCardContainer>
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
        v-if="collections.data.value && collections.data.value.totalPages > 1"
        v-model:page="page"
        :page-count="collections.data.value.totalPages"
      />
    </template>
  </NCard>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints, useSwipe } from "@vueuse/core";

const { $client } = useNuxtApp();

// 当前选中的标签
const selectedTab = ref<"Plan" | "Watching" | "Finished">("Watching");
watch(selectedTab, () => {
  page.value = 1;
  collections.execute();
});

// 当前页码
const page = ref(1);
watch(page, () => collections.execute());
// 界面尺寸，为了美观，在手机上三行，在电脑上二行
const pageSize = computed(() => {
  const breakpoint = useBreakpoints(breakpointsTailwind);
  if (breakpoint.greater("2xl").value) return 2 * 10;
  if (breakpoint.greater("xl").value) return 2 * 8;
  if (breakpoint.greater("lg").value) return 2 * 7;
  if (breakpoint.greater("md").value) return 3 * 5;
  if (breakpoint.greater("sm").value) return 3 * 4;
  return 3 * 3;
});
watch(pageSize, () => {
  page.value = 1;
  collections.execute();
});

// 数据
const collections = useAsyncData(
  () =>
    $client.common.animeCollection.getUserAnimeCollections.query({
      status: selectedTab.value,
      page: page.value,
      pageSize: pageSize.value,
    }),
  {
    lazy: true,
  },
);

// 获取追番总数
const collectionsCount = useAsyncData(
  () => $client.common.animeCollection.getUserAnimeCollectionCounts.query(),
  {
    lazy: true,
  },
);

// 滑动
const containerRef = ref<HTMLElement | null>(null);

const { direction } = useSwipe(containerRef, {
  threshold: 50,
  onSwipeEnd(e) {
    const tabs: ("Plan" | "Watching" | "Finished")[] = [
      "Plan",
      "Watching",
      "Finished",
    ];
    const currentIndex = tabs.indexOf(selectedTab.value);
    if (direction.value === "left") {
      // 切换下一个 tab
      const nextIndex = (currentIndex + 1) % tabs.length;
      selectedTab.value = tabs[nextIndex];
    } else if (direction.value === "right") {
      // 切换上一个 tab
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      selectedTab.value = tabs[prevIndex];
    }
  },
});
</script>

<style scoped></style>
