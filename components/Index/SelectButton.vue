<template>
  <div
    class="rounded cursor-pointer duration-100 px-2.5 py-1"
    :class="
      active
        ? 'bg-blue-600 text-white shadow'
        : 'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600'
    "
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
