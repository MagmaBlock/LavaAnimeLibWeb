<template>
  <div
    class="transition relative h-12 grid content-center select-none"
    :class="[...buttonColorClass, 'rounded-md']"
  >
    <!-- 集数 -->
    <div class="leading-none text-center text-sm">
      {{ formattedEpisodeDisplay }}
    </div>
    <!-- 多集数时展现 -->
    <div
      v-if="multipleEpisodes"
      class="absolute h-0.5 w-3 mx-auto inset-x-0 bottom-1 rounded"
      :class="getIndicatorColorClass"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  episodeDisplay: number | string;
  active?: boolean;
  multipleEpisodes?: boolean;
  notUpdated?: boolean;
}>();

const formattedEpisodeDisplay = computed(() => {
  if (typeof props.episodeDisplay === "number") {
    return props.episodeDisplay.toString().padStart(2, "0");
  }
  return props.episodeDisplay;
});

const buttonColorClass = computed(() => {
  if (props.active) {
    return [
      "bg-blue-600 dark:bg-blue-600 text-white",
      "active:bg-blue-500 dark:active:bg-blue-700",
    ];
  } else if (props.notUpdated) {
    return [
      "cursor-pointer",
      "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600",
      "hover:bg-zinc-100 dark:hover:bg-zinc-800",
      "active:bg-zinc-200 dark:active:bg-zinc-900",
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

const getIndicatorColorClass = computed(() => {
  if (props.active) {
    return "bg-zinc-200";
  } else if (props.notUpdated) {
    return "bg-zinc-300 dark:bg-zinc-700";
  } else {
    return "bg-zinc-300 dark:bg-zinc-500";
  }
});
</script>

<style scoped></style>
