<template>
  <NCard :bordered="false" size="small" title="本章节的视频列表">
    <NFlex vertical>
      <template v-if="store.activeEpisode?.mirrorGroupNames">
        <AnimeEpisodeDetailsFileDisplay
          v-for="groupName in store.activeEpisode.mirrorGroupNames"
          class="w-full"
          :key="groupName"
          :groups="getMirrorGroupByName(groupName)?.parseResult.group.map((g: any) => g?.parsedName ?? g?.name) ?? []"
          :title="getMirrorGroupByName(groupName)?.parseResult.title ?? ''"
          :subtitles="
            getMirrorGroupByName(groupName)?.parseResult.subtitle.language
              .map((l: any) => l.toString())
              .concat(getMirrorGroupByName(groupName)?.parseResult.subtitle.subtitleFeatures ?? []) ?? []
          "
          :sources="
            (
              getMirrorGroupByName(groupName)?.parseResult.source
                .broadcastChannel ?? []
            ).concat(
              getMirrorGroupByName(groupName)?.parseResult.source.mediaType ??
                []
            )
          "
          :quality="
            [
              getMirrorGroupByName(groupName)?.parseResult.quality.audioCodec,
              getMirrorGroupByName(groupName)?.parseResult.quality.color,
              getMirrorGroupByName(groupName)?.parseResult.quality.fps,
              getMirrorGroupByName(groupName)?.parseResult.quality.resolution,
              getMirrorGroupByName(groupName)?.parseResult.quality.videoCodec,
            ].filter((q: any) => q !== null)
          "
          :extension="
            getMirrorGroupByName(groupName)?.parseResult.extension.parsedName
          "
          :fileName="groupName"
          :active="store.activeMirrorGroupName === groupName"
          @click="setActiveMirrorGroupName(groupName)"
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
const store = useAnimeStore();

const getMirrorGroupByName = (groupName: string) => {
  return store.mainData?.mirrorGroups?.find(
    (group) => group.fileName === groupName
  );
};

const setActiveMirrorGroupName = (groupName: string) => {
  store.activeMirrorGroupName = groupName;
};
</script>

<style scoped></style>
