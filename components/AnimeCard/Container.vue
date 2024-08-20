<script setup lang="ts">
const props = defineProps<{
  size: "full" | "large" | "half" | "small" | "alwaysMobile"; // 决定屏幕宽度  目前有 full large half alwaysMobile
  loading?: boolean; // 决定是否显示为加载状态
  empty?: boolean; // 决定是否显示为空状态
}>();

const autoGroupClass = computed(() => {
  return {
    // 满屏
    full: "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 md:gap-x-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10",
    // 半屏以上
    large:
      "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    // 半屏
    half: "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5",
    // 半屏以下
    small:
      "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3",
    // 总是 3 个
    alwaysMobile: "grid grid-cols-3 gap-3 sm:grid-cols-3",
  }[props.size];
});
</script>

<template>
  <div class="select-none w-full" ref="target">
    <NEmpty
      v-if="empty"
      size="large"
      description="太可惜了，什么也没找到"
      class="py-16"
    />
    <NSpin v-else :show="loading" class="w-full">
      <div :class="autoGroupClass" class="w-full">
        <slot />
      </div>
    </NSpin>
  </div>
</template>
