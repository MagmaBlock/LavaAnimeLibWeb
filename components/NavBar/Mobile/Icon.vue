<script setup lang="ts">
const props = defineProps<{
  name?: string;
  active?: boolean;
}>();

const colorClass = computed(() => {
  return props.active
    ? "text-blue-600 dark:text-blue-500"
    : "text-zinc-500 dark:text-zinc-400";
});
</script>

<template>
  <div class="w-full self-center">
    <div :class="colorClass" class="text-center transition active:opacity-50">
      <div class="grid place-items-center mb-0.5">
        <NIcon :size="24">
          <slot name="icon"></slot>
        </NIcon>
      </div>
      <div class="text-[10px]">
        {{ name }}
      </div>
    </div>
  </div>
</template>
