<template>
  <div
    class="fixed w-screen h-screen flex flex-col lg:flex-row flex-nowrap max-w-[2560px] mx-auto"
  >
    <!-- 宽屏导航栏 -->
    <NavBarWide class="hidden lg:flex flex-none h-full" />
    <!-- 当前路由的界面 -->
    <NScrollbar class="flex-1 h-full mx-auto">
      <slot></slot>
    </NScrollbar>
    <!-- 移动端导航栏 -->
    <NavBarMobile class="lg:hidden flex-none" />
    <!-- 背景图片 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup></script>
