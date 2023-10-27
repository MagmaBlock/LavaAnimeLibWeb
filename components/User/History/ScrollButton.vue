<template>
  <div>
    <div
      class="w-10 h-10 grid place-items-center rounded-full shadow-md cursor-pointer bg-zinc-200 dark:bg-zinc-700 bg-opacity-90 text-zinc-700 dark:text-zinc-200 transition-transform hover:scale-110 active:scale-100"
    >
      <Icon
        name="material-symbols:chevron-right"
        size="22"
        v-if="direction == 'right'"
      />
      <Icon
        name="material-symbols:chevron-left"
        size="22"
        v-if="direction == 'left'"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
  },
});
</script>
