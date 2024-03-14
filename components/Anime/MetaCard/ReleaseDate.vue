<template>
  <div class="flex place-items-center gap-1">
    <Icon icon="material-symbols:calendar-month" />
    <div v-if="date">{{ date }}</div>
    <div v-else>未知时间</div>
    开始放送
  </div>
</template>

<script lang="ts" setup>
defineProps({
  date: String,
});
</script>

<style></style>
