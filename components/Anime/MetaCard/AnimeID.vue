<template>
  <NPopover>
    <template #trigger>
      <div class="flex place-items-center gap-1 cursor-help">
        <Icon icon="material-symbols:alternate-email" /> LA{{ id }}
      </div>
    </template>
    代表此动画在本站点的 LavaAnimeLib ID
  </NPopover>
</template>

<script lang="ts" setup>
defineProps({
  id: Number,
});
</script>

<style></style>
