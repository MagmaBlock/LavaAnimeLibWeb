<template>
  <ContainerPageMobileFull>
    <div class="grid grid-cols-3 gap-4 items-start">
      <AnimeMetaCard class="col-span-2" :animeId="animeId" />
      <div class="flex flex-col gap-4 col-span-1">
        <AnimeEpisodeCard
          :animeId="animeId"
          @episodeChange="handleEpisodeChange"
        />
        <AnimeEpisodeDetails
          v-if="activeEpisodeId"
          :key="activeEpisodeId"
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0 }"
          :duration="300"
          :episode-id="activeEpisodeId"
        />
      </div>
    </div>
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
const route = useRoute();
const animeId = computed(() => Number(route.params.la));

const activeEpisodeId = ref<number | null>(null);

const handleEpisodeChange = (episodeId: number | null) => {
  activeEpisodeId.value = episodeId;
};
</script>
