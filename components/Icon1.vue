<template>
  <Icon v-bind:icon="icon" :height="height" :width="width"> </Icon>
</template>

<script setup>
// 这个组件的存在，就是因为 nuxt 官方的 icon 库有意外 BUG
// 会导致在路由切换时出现 vnode 错误。
// 因此我们写了这一个代替品，问题就暂时解决了。
import { Icon } from "@iconify/vue";

const props = defineProps({
  name: {
    type: String,
  },
  size: {
    type: [String, Number],
  },
});

const icon = toRef(props.name);
const height = toRef(props.size);
const width = toRef(props.size);
</script>

<style></style>
