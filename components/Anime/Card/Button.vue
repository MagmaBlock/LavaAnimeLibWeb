<template>
  <div class="select-none" :class="[...activeColorClass, isRounded]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
});

const activeColorClass = computed(() => {
  if (props.active) {
    return [
      "bg-blue-600 dark:bg-blue-600 text-white",
      "active:bg-blue-500 dark:active:bg-blue-700",
    ];
  } else {
    return [
      "bg-zinc-100 dark:bg-zinc-800",
      "hover:bg-zinc-200 dark:hover:bg-zinc-700",
      "active:bg-zinc-300 dark:active:bg-zinc-800",
    ];
  }
});

const isRounded = computed(() => (props.rounded ? "rounded" : ""));
</script>
