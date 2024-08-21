<template>
  <NEllipsis
    v-if="!loading"
    class="text-xs opacity-75"
    :line-clamp="3"
    expand-trigger="click"
  >
    <div v-html="formattedContent"></div>
    <template #tooltip> 点击展开 </template>
  </NEllipsis>
  <NSkeleton v-else text :repeat="3" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  content?: string | null | undefined;
  loading?: boolean;
}

const props = defineProps<Props>();

const formattedContent = computed(() => {
  return props.content?.replace(/\n/g, "<br>") ?? "";
});
</script>

<style></style>
