<template>
  <NCard :bordered="false" size="small" title="本章节的视频列表">
    <NFlex vertical>
      <template v-if="store.activeEpisode?.mirrorGroups">
        <AnimeEpisodeDetailsFileDisplay
          v-for="group in store.activeEpisode.mirrorGroups"
          class="w-full"
          :key="group.group[0].name"
          :groups="group.parseResult.group.map((g: any) => g?.parsedName ?? g?.name)"
          :title="group.parseResult.title ?? ''"
          :subtitles="
            group.parseResult.subtitle.language
              .map((l: any) => l.toString())
              .concat(group.parseResult.subtitle.subtitleFeatures)
          "
          :sources="
            group.parseResult.source.broadcastChannel.concat(
              group.parseResult.source.mediaType
            )
          "
          :quality="
            [
              group.parseResult.quality.audioCodec,
              group.parseResult.quality.color,
              group.parseResult.quality.fps,
              group.parseResult.quality.resolution,
              group.parseResult.quality.videoCodec,
            ].filter((q: any) => q !== null)
          "
          :extension="group.parseResult.extension.parsedName"
          :fileName="group.group[0].name"
          :active="
            store.activeMirrorGroup?.group
              .map((g) => g.id)
              .includes(group.group[0].id)
          "
          @click="store.activeFileId = group.group[0].id"
        />
      </template>
    </NFlex>
    <NSkeleton
      v-if="store.episodesStatus === 'pending'"
      size="small"
      :sharp="false"
      :repeat="2"
    />
  </NCard>
</template>

<script lang="ts" setup>
const store = useAnimeStore();
</script>

<style scoped></style>
