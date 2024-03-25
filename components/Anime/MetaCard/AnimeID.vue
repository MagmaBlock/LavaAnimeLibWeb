<template>
  <NPopover v-if="id">
    <template #trigger>
      <div class="flex place-items-center gap-1 cursor-help">
        <Icon icon="material-symbols:alternate-email" /> LA{{ id }}
      </div>
    </template>
    <div class="break-words">代表此动画在本站点的 ID</div>
  </NPopover>
</template>

<script lang="ts" setup>
defineProps({
  id: Number,
});
</script>

<style></style>
