<template>
  <NCollapseTransition :show="haveSubtitles">
    <div class="flex items-center gap-2 flex-nowrap">
      <NSwitch v-model:value="animeStore.subtitleData.enabled" />
      <Icon name="material-symbols:subtitles-outline" class="w-6 h-6" />
      <NSelect
        v-if="haveSubtitles"
        size="small"
        :options="subtitleSelectList"
        :value="subtitleSelectCurrentValue"
        :dropdown-props="{ trigger: 'click', showArrow: true }"
        @update:value="handleSubtitleSelect"
        class="truncate"
      >
        <template #header>
          <NAlert type="info">
            本视频支持外挂字幕，您可以切换不同的字幕轨道。通常中文字幕以"zh"、"chi"来结尾。
          </NAlert>
        </template>
      </NSelect>
    </div>
  </NCollapseTransition>
</template>

<script lang="ts" setup>
const animeStore = useAnimeStore();

const haveSubtitles = computed(() =>
  animeStore.subtitleList?.length > 0 ? true : false
);

const subtitleSelectList = computed(() => {
  return animeStore.subtitleList.map((file) => {
    const displayName =
      file.name.length > 60 ? `...${file.name.slice(-30)}` : file.name;

    return {
      label: displayName,
      value: file.name,
    };
  });
});

const subtitleSelectCurrentValue = computed(() => {
  return animeStore.activeSubtitle?.name;
});

function handleSubtitleSelect(value: string) {
  animeStore.subtitleData.subtitleFileName = value;
  animeStore.subtitleData.enabled = true;
}
</script>
