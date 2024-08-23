<template>
  <NCard embedded :bordered="false" size="small" title="剧集详情">
    <NFlex vertical size="large">
      <AnimeEpisodeDetailsInfomations
        v-bind="episodeDetails"
        poster="https://placehold.co/300x200?text=Demo"
      />

      <NSpin :show="store.episodeDetailsStatus === 'pending'" :delay="500">
        <NFlex vertical>
          <NScrollbar x-scrollable>
            <NFlex>
              <template
                v-if="store.episodeDetailsStatus === 'success'"
                v-for="file in processedFiles"
                :key="file.file.id"
              >
                <AnimeEpisodeDetailsFileDisplay v-bind="file" />
              </template>
            </NFlex>
          </NScrollbar>
          <NSkeleton
            v-if="store.episodeDetailsStatus === 'pending'"
            size="small"
            :sharp="false"
            :repeat="2"
          />
        </NFlex>
      </NSpin>
    </NFlex>
  </NCard>
</template>

<script lang="ts" setup>
const store = useAnimeStore();

// 计算当前选中剧集的详细信息
const episodeDetails = computed(() => {
  const activeEpisode = store.episodeDetails?.episode;

  return {
    episode: activeEpisode?.episodeIndex ?? 0,
    name: activeEpisode?.name ?? "",
    airDate: activeEpisode?.airDate ?? "",
    duration: activeEpisode?.duration ?? 0,
    summary: activeEpisode?.summary ?? "",
  };
});

const processedFiles = computed(() => {
  if (!store.episodeDetails) return [];
  return store.episodeDetails.files.map((file) => ({
    file: file.file,
    groups: file.parseResult.group.map((g) => g.parsedName ?? g.name),
    title: file.parseResult.title,
    subtitles: file.parseResult.subtitle.language
      .map((l) => l.toString())
      .concat(file.parseResult.subtitle.subtitleFeatures),
    sources: file.parseResult.source.broadcastChannel.concat(
      file.parseResult.source.mediaType
    ),
    quality: [
      file.parseResult.quality.audioCodec,
      file.parseResult.quality.color,
      file.parseResult.quality.fps,
      file.parseResult.quality.resolution,
      file.parseResult.quality.videoCodec,
    ].filter((q) => q !== null),
    extension: file.parseResult.extension.parsedName,
    fileName: file.file.name,
  }));
});
</script>

<style></style>
