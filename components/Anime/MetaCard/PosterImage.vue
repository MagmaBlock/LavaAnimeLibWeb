<template>
  <div>
    <img
      v-if="posterUrl"
      :src="posterUrl"
      alt="封面图片"
      class="rounded-md"
      :class="mini ? 'max-w-24' : 'max-w-32'"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  posterUrl?: string | null;
  mini?: boolean | null;
}>();
</script>
