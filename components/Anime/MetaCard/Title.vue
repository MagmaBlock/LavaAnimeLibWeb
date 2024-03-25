<template>
  <NSpace :align="'baseline'">
    <div class="text-lg font-semibold">
      <p v-if="title">{{ title }}</p>
      <NSkeleton v-if="loading" :width="128" />
    </div>
    <div class="text-sm font-semibold text-gray-500" v-if="originalTitle">
      <p>{{ originalTitle }}</p>
    </div>
  </NSpace>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
  },
  originalTitle: {
    type: String,
  },
  loading: {
    type: Boolean,
  },
});
</script>

<style></style>
