<template>
  <div
    class="grid grid-cols-1 gap-2 bg-zinc-50 dark:bg-zinc-900 lg:rounded-md"
    :class="border ? 'px-4 py-2' : ''"
  >
    <NSpace vertical size="large">
      <div v-if="slots?.header">
        <slot name="header"></slot>
      </div>
      <div v-if="slots?.default">
        <slot></slot>
      </div>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots();

withDefaults(
  defineProps<{
    border?: boolean;
  }>(),
  {
    border: true,
  }
);
</script>
