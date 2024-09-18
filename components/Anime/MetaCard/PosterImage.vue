<template>
  <NImage
    v-if="posterUrl && !isError"
    :src="posterUrl"
    @error="isError = true"
    alt="封面图片"
    class="rounded-md"
    :class="mini ? 'max-w-24' : 'max-w-32'"
  />
</template>

<script lang="ts" setup>
defineProps<{
  posterUrl?: string | null;
  mini?: boolean | null;
}>();

const isError = ref(false);
</script>
