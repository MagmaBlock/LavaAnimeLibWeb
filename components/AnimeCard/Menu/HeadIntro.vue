<template>
  <div>
    <div class="text-xs mb-1">
      {{ platform }}
      {{ region }}
      {{ releaseYear }}
      {{ releaseSeason }}
    </div>
    <div class="text-base" v-if="name">
      {{ name }}
    </div>
    <div class="text-xs opacity-75" v-if="originalName">
      {{ originalName }}
    </div>
    <div class="my-1 space-x-1">
      <NTag v-if="bdrip" type="info" size="small"> BDRip </NTag>
      <NTag v-if="nsfw" type="warning" size="small"> NSFW </NTag>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  releaseYear?: string | number | null;
  releaseSeason?: string | null;
  platform?: string | null;
  region?: string | null;
  name?: string | null;
  originalName?: string | null;
  bdrip?: boolean | null;
  nsfw?: boolean | null;
}>();
</script>

<style></style>
