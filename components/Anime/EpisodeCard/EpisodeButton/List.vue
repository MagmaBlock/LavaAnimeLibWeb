<template>
  <NFlex
    :wrap="false"
    class="rounded-md transition-opacity"
    :class="{
      'cursor-pointer active:opacity-75': !active,
    }"
  >
    <NImage
      v-if="poster"
      :src="poster"
      object-fit="cover"
      class="rounded-md w-[100px] h-[60px] flex-shrink-0"
    />
    <div
      v-else
      class="rounded-md w-[100px] h-[60px] flex-shrink-0 bg-zinc-800"
    />
    <NFlex
      vertical
      justify="center"
      :size="0"
      :class="active ? 'text-blue-500' : ''"
    >
      <div class="flex items-center gap-1">
        <Icon
          v-if="active"
          class="animate-pulse"
          name="material-symbols:play-arrow-rounded"
        />
        第{{ episodeDisplay }}话
      </div>
      <div>{{ name }}</div>
    </NFlex>
  </NFlex>
</template>

<script lang="ts" setup>
defineProps<{
  poster?: string | null;
  name?: string | null;
  episodeDisplay: number | string;
  active?: boolean;
}>();
</script>

<style></style>
