<template>
  <div class="flex place-items-center gap-1">
    <Icon icon="material-symbols:play-circle-rounded" />
    <div v-if="views !== null || views !== undefined">{{ views }} 次播放</div>
    <NSkeleton v-else :width="64" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  views: Number,
});
</script>

<style></style>
