<template>
  <n-spin :show="loading">
    <div
      class="py-1.5 px-4 rounded transition-all cursor-pointer"
      :class="[active ? activeClass : normalClass, disable ? disableClass : '']"
    >
      <div>
        {{ name }}
      </div>
      <div class="text-xs opacity-80">
        {{ description }}
      </div>
    </div>
  </n-spin>
</template>

<script setup>
const { active, name, description, disable } = defineProps({
  active: Boolean,
  name: String,
  description: String,
  disable: Boolean,
  loading: Boolean,
});

const activeClass = "bg-blue-600 text-white ";
const normalClass =
  "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 active:dark:bg-blue-600 active:dark:text-white";
const disableClass = "opacity-50 brightness-75";
</script>
