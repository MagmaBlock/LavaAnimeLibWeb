<template>
  <div
    v-if="views !== null && views !== undefined"
    class="flex place-items-center gap-1"
  >
    <Icon icon="material-symbols:play-circle-rounded" />
    <div>{{ views }} 次播放</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  views: Number,
});
</script>

<style></style>
