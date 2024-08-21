<template>
  <div>
    <img
      v-if="posterUrl"
      :src="posterUrl"
      alt="封面图片"
      class="rounded-md"
      :class="mini ? 'max-w-24' : 'max-w-32'"
    />
    <!-- Loading -->
    <div
      v-if="loading"
      class="poster-skeleton overflow-hidden rounded-md"
      :class="mini ? 'max-w-24' : 'max-w-32'"
    >
      <NSkeleton class="w-96 h-96" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  posterUrl?: string | null;
  loading?: boolean | null;
  mini?: boolean | null;
}>();
</script>

<style scoped>
.poster-skeleton {
  aspect-ratio: 2 / 3;
}
</style>
