<script setup lang="ts">
const { currentSelected } = useAnimeIndexStore();

const page = ref(1);

const animes = ref<any[]>([]);

watch(
  currentSelected,
  () => {
    // fetchAnimes();
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
            :poster="anime.data.poster.url"
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
