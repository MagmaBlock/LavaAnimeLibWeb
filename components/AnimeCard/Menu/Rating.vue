<template>
  <div class="flex flex-col space-y-1">
    <div class="flex flex-wrap gap-2 text-xs">
      <NTag v-if="rank" size="small" type="info"> 排名: {{ rank }} </NTag>
      <NTag v-if="count" size="small" type="default"> {{ count }}人评分 </NTag>
      <NTag v-if="source" size="small" type="warning">
        来源: {{ source }}
      </NTag>
    </div>
    <div class="flex items-center space-x-2">
      <NRate :value="score / 2" readonly allow-half size="small" />
      <span class="text-sm font-medium">{{ score.toFixed(1) }}</span>
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
