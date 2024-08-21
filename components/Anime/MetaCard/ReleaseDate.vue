<template>
  <div class="flex place-items-center gap-1">
    <Icon icon="material-symbols:calendar-month" />
    <div v-if="date">{{ formatDate(date) }}</div>
    <div v-else>未知时间</div>
    开始放送
  </div>
</template>

<script lang="ts" setup>
interface Props {
  date?: string | Date | null;
}

defineProps<Props>();

function formatDate(date: string | Date | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN");
}
</script>

<style></style>
