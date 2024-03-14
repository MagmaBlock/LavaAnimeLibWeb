<template>
  <NPopover>
    <template #trigger>
      <div class="flex place-items-center gap-1 cursor-help">
        <Icon icon="material-symbols:star-rounded" />
        <div v-if="rating">{{ rating }} 分</div>
        <div v-if="rank">#{{ rank }}</div>
        <NSkeleton v-else :width="64" />
      </div>
    </template>
    评分数据来自 Bangumi 番组计划，“#” 代表此番剧在 Bangumi 的全站排名
  </NPopover>
</template>

<script lang="ts" setup>
defineProps({
  rating: Number,
  rank: Number,
});
</script>

<style></style>
