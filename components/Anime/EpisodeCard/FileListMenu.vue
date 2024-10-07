<template>
  <NCard :bordered="false" size="small" title="本章节的视频列表">
    <NFlex vertical>
      <template v-if="store.activeEpisode?.similarFilesIds">
        <AnimeEpisodeDetailsFileDisplay
          v-for="similarFiles in activeEpisodeFiles"
          class="w-full"
          :key="similarFiles.uniqueId"
          :groups="parseFileName(similarFiles.fileName).group.map((g: any) => g?.parsedName ?? g?.name) ?? []"
          :title="parseFileName(similarFiles.fileName).title ?? ''"
          :subtitles="
            parseFileName(similarFiles.fileName).subtitle.language
              .map((l: any) => l.toString())
              .concat(parseFileName(similarFiles.fileName).subtitle.subtitleFeatures ?? []) ?? []
          "
          :sources="
            (
              parseFileName(similarFiles.fileName).source.broadcastChannel ?? []
            ).concat(
              parseFileName(similarFiles.fileName).source.mediaType ?? []
            )
          "
          :quality="
            [
              parseFileName(similarFiles.fileName).quality.audioCodec,
              parseFileName(similarFiles.fileName).quality.color,
              parseFileName(similarFiles.fileName).quality.fps,
              parseFileName(similarFiles.fileName).quality.resolution,
              parseFileName(similarFiles.fileName).quality.videoCodec,
            ].filter((q) => q !== null)
          "
          :extension="parseFileName(similarFiles.fileName).extension.parsedName"
          :fileName="similarFiles.fileName"
          :active="store.activeSimilarFilesId === similarFiles.uniqueId"
          @click="setActiveSimilarFilesId(similarFiles.uniqueId)"
        />
      </template>
    </NFlex>
    <NSkeleton
      v-if="store.mainDataStatus === 'pending'"
      size="small"
      :sharp="false"
      :repeat="2"
    />
  </NCard>
</template>

<script lang="ts" setup>
import { parseFileName } from "anime-name-tool";
import type { SimilarFiles } from "~/server/services/anime/file/types/similar-files";

const store = useAnimeStore();

const activeEpisodeFiles = computed<SimilarFiles[]>(() => {
  const ids = store.activeEpisode?.similarFilesIds ?? [];
  return ids
    .map((id) => getSimilarFilesById(id))
    .filter((sf) => sf !== undefined);
});

const getSimilarFilesById = (
  similarFilesId: string
): SimilarFiles | undefined => {
  return store.mainData?.similarFiles.find(
    (sf) => sf.uniqueId === similarFilesId
  );
};

const setActiveSimilarFilesId = (similarFilesId: string) => {
  store.activeSimilarFilesId = similarFilesId;
};
</script>

<style scoped></style>
