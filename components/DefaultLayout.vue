<template>
  <div class="max-w-[2560px] mx-auto">
    <!-- 宽屏导航栏 -->
    <NavBarWide
      class="fixed top-0 left-0 bottom-0 z-50"
      v-if="breakpoints.greaterOrEqual('lg').value"
    />
    <!-- 当前路由的界面 -->
    <NScrollbar class="pb-16 lg:pb-0 lg:pl-16 lg:h-dvh">
      <slot></slot>
    </NScrollbar>
    <!-- 移动端导航栏 -->
    <NavBarMobile
      class="fixed inset-x-0 bottom-0"
      v-if="breakpoints.smaller('lg').value"
    />
    <!-- 背景图片 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
</script>
