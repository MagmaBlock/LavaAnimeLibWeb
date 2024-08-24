<template>
  <NCard embedded :bordered="false" size="small" title="剧集详情">
    <NFlex vertical size="large">
      <AnimeEpisodeDetailsInfomations
        v-if="activeEpisode"
        :episode="activeEpisode.episode.episodeIndex ?? 0"
        :name="activeEpisode.episode.name ?? ''"
        :air-date="activeEpisode.episode.airDate ?? ''"
        :duration="activeEpisode.episode.duration ?? 0"
        :summary="activeEpisode.episode.summary ?? ''"
        poster="https://placehold.co/300x200?text=Demo"
      />
    </NFlex>
  </NCard>
</template>

<script lang="ts" setup>
const store = useAnimeStore();
const activeEpisode = store.activeEpisode;
</script>

<style></style>
