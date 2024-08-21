<template>
  <div class="fixed h-full w-full flex flex-nowrap max-w-[2560px] mx-auto">
    <!-- 导航栏 -->
    <NavBar class="flex-none h-full" />
    <!-- 当前路由的界面 -->
    <NScrollbar class="flex-1 h-full mx-auto">
      <!-- 手机端: 自动添加底部 padding; 宽屏: 自动添加导航栏宽度的左 padding -->
      <div class="pb-36 lg:pb-0">
        <slot></slot>
      </div>
    </NScrollbar>

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup></script>
