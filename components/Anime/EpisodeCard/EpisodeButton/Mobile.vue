<template>
  <div class="bg-zinc-200 dark:bg-zinc-800 rounded-md w-32 h-18 px-2 py-1">
    <div
      class="text-xs space-y-0.5"
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
      <NEllipsis :line-clamp="2">{{ name }}</NEllipsis>
      <div v-if="notUpdated" class="text-xs text-zinc-500">暂无内容</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name?: string | null;
  episodeDisplay: number | string;
  active?: boolean;
  notUpdated?: boolean;
}>();
</script>

<style></style>
