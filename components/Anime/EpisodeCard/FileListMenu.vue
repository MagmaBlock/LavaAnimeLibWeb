<template>
  <div>
    <div class="text-base mb-4">
      {{
        store.activeEpisodeId
          ? `当前章节下的文件（${activeEpisodeFileCount} 个）`
          : "正在播放的文件"
      }}
    </div>
    <NFlex vertical>
      <!-- 如果当前有选中的剧集，则展示剧集的文件列表 -->
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
      <!-- 如果当前没有选中的剧集，但是仍有选中的附件文件，则展示附件文件的文件列表 -->
      <template v-else-if="store.activeFileId">
        <AnimeEpisodeDetailsFileDisplay
          class="w-full"
          v-if="activeFile"
          :groups="
            parseFileName(activeFile.fileName).group.map(
              (g) => g?.parsedName ?? g?.name
            )
          "
          :title="parseFileName(activeFile.fileName).title ?? ''"
          :subtitles="
            parseFileName(activeFile.fileName)
              .subtitle.language.map((l) => l.toString())
              .concat(
                parseFileName(activeFile.fileName).subtitle.subtitleFeatures
              )
          "
          :sources="
            parseFileName(activeFile.fileName).source.broadcastChannel.concat(
              parseFileName(activeFile.fileName).source.mediaType
            )
          "
          :quality="
            [
              parseFileName(activeFile.fileName).quality.audioCodec,
              parseFileName(activeFile.fileName).quality.color,
              parseFileName(activeFile.fileName).quality.fps,
              parseFileName(activeFile.fileName).quality.resolution,
              parseFileName(activeFile.fileName).quality.videoCodec,
            ].filter((q) => q !== null)
          "
          :extension="parseFileName(activeFile.fileName).extension.parsedName"
          :fileName="activeFile.fileName"
          :active="store.activeSimilarFilesId === activeFile.uniqueId"
          @click="setActiveSimilarFilesId(activeFile.uniqueId)"
        />
      </template>
      <!-- Loading -->
      <NSkeleton
        v-if="store.mainDataStatus === 'pending'"
        size="small"
        :sharp="false"
        :repeat="2"
      />
    </NFlex>
  </div>
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

const activeFile = computed<SimilarFiles | undefined>(() => {
  return store.mainData?.similarFiles.find((sf) => {
    return sf.files.find((f) => f.id === store.activeFileId);
  });
});

const activeEpisodeFileCount = computed(() => {
  const activeEpisode = store.mainData?.episodes.find(
    (ep) => ep.episode.id === store.activeEpisodeId
  );
  return activeEpisode?.similarFilesIds.length ?? 0;
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
