<script setup lang="ts">
const { currentSelected } = useAnimeIndexStore();

const page = ref(1);

const animes = ref<any[]>([]);

async function fetchAnimes() {
  animes.value = await $fetch("/api/v3/anime-index/filter-anime", {
    method: "GET",
    params: {
      releaseYear: currentSelected.years,
      releaseSeason: currentSelected.sessions,
      platform: currentSelected.platforms,
      region: currentSelected.regions,
      sort: currentSelected.sort,
      page: page.value,
    },
  });
}

watch(
  currentSelected,
  () => {
    fetchAnimes();
  },
  { immediate: true }
);
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
        <AnimeCardContainer size="large" v-if="animes.length">
          <AnimeCard
            v-for="anime in animes"
            :id="anime.data.id"
            :name="anime.data.name"
            :bdrip="anime.data.bdrip"
            :nsfw="anime.data.nsfw"
            :views="anime.views"
          />
        </AnimeCardContainer>
      </template>
      <!-- 扩展页尾 -->
      <template #foot>
        <IndexActivityCard />
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>
