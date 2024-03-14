<template>
  <div class="flex place-items-center gap-1">
    <Icon icon="material-symbols:stack" />
    <div v-if="count">共 {{ count }} 话</div>
    <NSkeleton v-else :width="64"></NSkeleton>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  count: Number,
});
</script>

<style></style>
