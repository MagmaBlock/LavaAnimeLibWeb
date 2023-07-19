<template>
  <div>
    <div
      class="w-10 h-10 grid place-items-center rounded-full shadow-md cursor-pointer bg-zinc-200 dark:bg-zinc-700 bg-opacity-90 text-zinc-700 dark:text-zinc-200 transition-transform hover:scale-110 active:scale-100"
    >
      <NIcon :size="14">
        <ArrowForwardIosFilled v-if="direction == 'right'" />
        <ArrowBackIosNewFilled v-if="direction == 'left'" />
      </NIcon>
    </div>
  </div>
</template>

<script setup>
import { ArrowForwardIosFilled, ArrowBackIosNewFilled } from "@vicons/material";

defineProps({
  direction: {
    type: String,
  },
});
</script>
