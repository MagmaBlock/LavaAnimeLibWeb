<template>
  <div v-if="count" class="flex place-items-center gap-1">
    <Icon icon="material-symbols:stack" />
    <div>共 {{ count }} 话</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  count: Number,
});
</script>

<style></style>
