<template>
  <div
    class="fixed w-screen h-screen flex flex-col lg:flex-row flex-nowrap max-w-[2560px] mx-auto"
  >
    <!-- 宽屏导航栏 -->
    <NavBarWide class="hidden lg:flex flex-none h-full" />
    <!-- 当前路由的界面 -->
    <NScrollbar class="flex-1 h-full mx-auto">
      <!-- 手机端: 自动添加底部 padding -->
      <div class="pb-56 lg:pb-0">
        <slot></slot>
      </div>
    </NScrollbar>

    <!-- 移动端导航栏 -->
    <NavBarMobile class="lg:hidden flex-none" />

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup></script>
