<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const { currentSelected } = useAnimeIndexStore();

const { $client } = useNuxtApp();

const fetchAnimes = await useAsyncData(
  "fetchAnimes",
  () =>
    $client.pages.animeIndex.filterAnime.query({
      releaseYear: currentSelected.years
        ? Number(currentSelected.years)
        : undefined,
      releaseSeason: currentSelected.sessions ?? undefined,
      platform: (currentSelected.platforms as any) ?? undefined,
      region: (currentSelected.regions as any) ?? undefined,
      sort: (currentSelected.sort as any) ?? undefined,
    }),
  {
    immediate: false,
  }
);

onMounted(() => fetchAnimes.execute());

watch(currentSelected, async () => {
  fetchAnimes.refresh();
  page.value = 1;
});

const page = ref(1);
const pageSize = 30;
const totalPages = computed(() => {
  if (fetchAnimes.data.value?.length) {
    return Math.ceil(fetchAnimes.data.value.length / pageSize);
  }
  return 0;
});
const currentPageAnimes = computed(() => {
  if (fetchAnimes.data.value?.length) {
    return fetchAnimes.data.value.slice(
      (page.value - 1) * pageSize,
      page.value * pageSize
    );
  }
  return [];
});

const breakpoints = useBreakpoints(breakpointsTailwind);
</script>

<template>
  <ContainerPage>
    <ContainerPageLeftMenuRightContent>
      <!-- 选项本体部分，将粘连屏幕 -->
      <template #left>
        <NFlex vertical>
          <NH3 class="my-4">番剧索引</NH3>
          <AnimeIndexFilterControl />
        </NFlex>
      </template>
      <!-- 番剧栅格部分 -->
      <template #right>
        <div class="relative">
          <AnimeCardContainer
            v-if="fetchAnimes.data.value?.length"
            v-motion-fade-visible
            :loading="fetchAnimes.status.value === 'pending'"
            size="large"
          >
            <AnimeCard
              v-for="anime in currentPageAnimes"
              :id="anime.id"
              :name="anime.name"
              :bdrip="anime.bdrip"
              :nsfw="anime.nsfw"
              :views="anime.views"
              :image="anime.poster ?? undefined"
            />
          </AnimeCardContainer>
        </div>
        <NPagination
          v-if="fetchAnimes.data.value && fetchAnimes.data.value.length"
          v-model:page="page"
          :page-count="totalPages"
          :page-slot="breakpoints.greaterOrEqual('sm').value ? 10 : 6"
          class="my-8"
        />
        <NEmpty
          class="my-16"
          v-if="fetchAnimes.data.value && fetchAnimes.data.value.length === 0"
        />
        <NBackTop :bottom="breakpoints.greaterOrEqual('lg').value ? undefined : 100" />
      </template>
      <!-- 扩展页尾 -->
      <template #foot>
        <IndexActivityCard />
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>
