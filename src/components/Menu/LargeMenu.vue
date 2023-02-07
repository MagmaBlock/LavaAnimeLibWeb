<!-- 本组件是一个适配手机和宽屏的菜单模板 -->
<!-- 在手机上, 内容将以底部抽屉的形态打开 -->
<!-- 在宽屏上, 内容将浮层显示到按钮的周围 -->
<template>
  <div>
    <!-- 宽屏 -->
    <n-popover v-if="isWide" trigger="click" placement="top">
      <template #trigger>
        <slot name="trigger"></slot>
      </template>
      <div>
        <slot></slot>
      </div>
    </n-popover>
    <!-- 手机 -->
    <div v-if="!isWide">
      <!-- 触发按钮 -->
      <div @click="showMe = !showMe">
        <slot name="trigger"></slot>
      </div>
      <!-- 抽屉 -->
      <n-drawer v-model:show="showMe" height="auto" placement="bottom" class="px-4 py-2">
        <slot></slot>
      </n-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showMe = ref(false)
const isWide = window.innerWidth >= 640 ? true : false
</script>