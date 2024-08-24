<template>
  <NFlex
    :wrap="false"
    class="cursor-pointer active:opacity-75 rounded-md transition-opacity"
  >
    <NImage
      v-if="poster"
      :src="poster"
      object-fit="cover"
      class="rounded-md w-[100px] h-[60px] flex-shrink-0"
    />
    <div
      v-else
      class="rounded-md w-[100px] h-[60px] flex-shrink-0 bg-zinc-200 dark:bg-zinc-800"
    />
    <NFlex
      vertical
      justify="center"
      :size="0"
      :class="[
        active ? 'text-blue-500' : '',
        notUpdated ? 'text-zinc-400 dark:text-zinc-600' : '',
      ]"
    >
      <div class="flex items-center gap-1">
        <Icon
          v-if="active"
          class="animate-pulse"
          name="material-symbols:play-arrow-rounded"
        />
        第{{ episodeDisplay }}话
      </div>
      <NEllipsis class="text-[13px]" :line-clamp="2">{{ name }}</NEllipsis>
      <div v-if="notUpdated" class="text-xs text-zinc-500">暂无内容</div>
    </NFlex>
  </NFlex>
</template>

<script lang="ts" setup>
defineProps<{
  poster?: string | null;
  name?: string | null;
  episodeDisplay: number | string;
  active?: boolean;
  notUpdated?: boolean;
}>();
</script>

<style></style>
