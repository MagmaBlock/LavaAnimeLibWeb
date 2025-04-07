<template>
  <NCollapseTransition :show="haveSubtitles">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <NSwitch v-model:value="animeStore.subtitleData.enabled" />
        <Icon name="material-symbols:subtitles-outline" :size="24" />
        <NSelect
          size="small"
          :options="subtitleSelectList"
          :value="subtitleSelectCurrentValue"
          @update:value="handleSubtitleSelect"
        >
          <template #header>
            <NAlert type="info">
              本视频支持外挂字幕，您可以切换不同的字幕轨道。通常中文字幕以
              "zh"、"chi" 来结尾。
              <br />
              番剧库默认会尝试帮您选择中文字幕，但这并不总是完美。
            </NAlert>
          </template>
        </NSelect>
      </div>
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
    return {
      label: file.name,
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

<style></style>
