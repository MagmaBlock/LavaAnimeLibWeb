<template>
  <div
    class="transition relative w-12 h-12 grid content-center select-none"
    :class="[...activeColorClass, 'rounded-md']"
  >
    <!-- 集数 -->
    <div class="leading-none text-center text-sm">
      {{ formattedEpisodeDisplay }}
    </div>
    <!-- 多集数时展现 -->
    <div
      v-if="multipleEpisodes"
      class="absolute h-0.5 w-3 mx-auto inset-x-0 bottom-1 rounded"
      :class="active ? 'bg-zinc-200' : 'bg-zinc-300 dark:bg-zinc-500'"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  episodeDisplay: number | string;
  active?: boolean;
  multipleEpisodes?: boolean;
}>();

const formattedEpisodeDisplay = computed(() => {
  if (typeof props.episodeDisplay === "number") {
    return props.episodeDisplay.toString().padStart(2, "0");
  }
  return props.episodeDisplay;
});

const activeColorClass = computed(() => {
  if (props.active) {
    return [
      "bg-blue-600 dark:bg-blue-600 text-white",
      "active:bg-blue-500 dark:active:bg-blue-700",
    ];
  } else {
    return [
      "cursor-pointer",
      "bg-zinc-100 dark:bg-zinc-800",
      "hover:bg-zinc-200 dark:hover:bg-zinc-700",
      "active:bg-zinc-300 dark:active:bg-zinc-800",
    ];
  }
});
</script>

<style scoped></style>
