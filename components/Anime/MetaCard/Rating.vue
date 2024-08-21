<template>
  <NPopover v-if="rating">
    <template #trigger>
      <div class="flex place-items-center gap-1 cursor-help">
        <Icon icon="material-symbols:star-rounded" />
        <div>{{ rating }} 分</div>
        <div v-if="rank">#{{ rank }}</div>
      </div>
    </template>
    评分数据来自 Bangumi 番组计划
    <br />
    "#" 代表此番剧在 Bangumi 的全站排名
  </NPopover>
</template>

<script lang="ts" setup>
interface Props {
  rating?: number | null | undefined;
  rank?: number | null | undefined;
}

defineProps<Props>();
</script>

<style></style>
