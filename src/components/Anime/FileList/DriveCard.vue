<template>
  <div
    class="py-1.5 px-4 rounded transition-all cursor-pointer"
    :class="active ? activeClass : normalClass"
  >
    <div>
      {{ name }}
    </div>
    <div class="text-xs opacity-80">
      {{ description }}
    </div>
  </div>
</template>

<script setup>
const { active, name, description } = defineProps({
  active: Boolean,
  name: String,
  description: String,
});

const activeClass = "bg-blue-600 text-white";
const normalClass =
  "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 active:bg-blue-600 active:text-white";
</script>
