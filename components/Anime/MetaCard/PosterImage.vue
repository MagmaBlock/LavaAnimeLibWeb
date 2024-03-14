<template>
  <div>
    <img
      v-if="posterUrl"
      :src="posterUrl"
      alt="封面图片"
      class="rounded-md max-w-32"
    />
    <!-- Loading -->
    <div v-else class="max-w-32 poster-skeleton overflow-hidden rounded-md">
      <NSkeleton class="w-96 h-96" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  posterUrl: String,
});
</script>

<style scoped>
.poster-skeleton {
  aspect-ratio: 2 / 3;
}
</style>
