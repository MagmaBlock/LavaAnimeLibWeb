<template>
  <div class="flex flex-col space-y-2">
    <div class="flex items-center space-x-2">
      <NRate :value="score / 2" readonly allow-half size="small" />
      <span class="font-medium text-xs">{{ score.toFixed(1) }}</span>
    </div>
    <div class="flex flex-wrap gap-2 text-xs">
      <NTag v-if="rank" size="small" :bordered="false" type="info">
        排名 {{ rank }}
      </NTag>
      <NTag v-if="count" size="small" :bordered="false" type="default">
        {{ count }} 人评分
      </NTag>
      <NTag v-if="source" size="small" :bordered="false" type="warning">
        来源 {{ source }}
      </NTag>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  score: number;
  rank?: number | null;
  count?: number | null;
  source?: string | null;
}>();
</script>

<style scoped></style>
