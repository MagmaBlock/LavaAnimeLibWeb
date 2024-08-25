<template>
  <div>
    <div class="flex items-center gap-1" v-if="name">
      <div class="text-lg">
        {{ name }}
      </div>
      <NTag v-if="bdrip" :bordered="false" type="info" size="tiny"> BD </NTag>
      <NTag v-if="nsfw" :bordered="false" type="warning" size="tiny">
        NSFW
      </NTag>
    </div>
    <div class="text-sm opacity-75" v-if="originalName">
      {{ originalName }}
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
