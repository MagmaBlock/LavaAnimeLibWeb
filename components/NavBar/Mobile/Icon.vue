<script setup lang="ts">
const route = useRoute();

const props = defineProps({
  // 此图标的名称
  title: {
    type: String,
    default: "图标",
  },
  // 目标路径
  name: {
    type: String,
    default: "index",
  },
});

// 根据路由点亮图标
const colorClass = computed(() => {
  return route.name == props.name
    ? "text-blue-600 dark:text-blue-500"
    : "text-gray-500 dark:text-gray-400";
});
</script>

<template>
  <div class="w-full self-center">
    <NuxtLink
      :to="{ name }"
      :class="colorClass"
      class="text-center duration-200"
    >
      <div
        class="lg:mx-2 lg:py-2 transition lg:hover:bg-zinc-200 lg:dark:hover:bg-zinc-800 active:scale-95 rounded-md"
      >
        <div
          class="grid place-items-center text-2xl lg:text-[28px] my-0.5 lg:my-1"
        >
          <slot></slot>
        </div>
        <div class="text-[10px] lg:text-xs">
          {{ title }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
