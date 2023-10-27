<template>
  <div
    class="rounded cursor-pointer duration-100 px-2.5 py-1"
    :class="
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-gray-500 dark:text-zinc-200'
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
