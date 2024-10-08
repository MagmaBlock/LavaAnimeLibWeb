<template>
  <NSpin :show="loading">
    <div
      :class="stateClassNames"
      class="py-1.5 px-4 rounded-md select-none transition"
      :active="active"
    >
      <div>
        {{ name }}
      </div>
      <div class="text-xs opacity-80">
        {{ description }}
      </div>
    </div>
  </NSpin>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  description?: string | null;
  active?: boolean;
  disable?: boolean;
  loading?: boolean;
}>();

const stateClassNames = computed(() => {
  return [
    // 活跃状态样式
    props.active
      ? "bg-blue-600 dark:bg-blue-600 text-white"
      : "bg-zinc-100 dark:bg-zinc-800",

    // 禁用状态样式
    props.disable
      ? "opacity-50 brightness-75 cursor-not-allowed"
      : "hover:brightness-95 active:brightness-90",
  ];
});
</script>
