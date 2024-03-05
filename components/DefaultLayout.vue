<template>
  <div class="flex max-w-[2560px] mx-auto">
    <!-- 导航栏 -->
    <NavBar class="fixed h-screen z-50" />
    <!-- 当前路由的界面 -->
    <!-- 手机端: 自动添加底部 padding; 宽屏: 自动添加导航栏宽度的左 padding -->
    <NScrollbar class="h-screen mx-auto">
      <div class="pb-36 lg:pb-0 lg:pl-[84px]">
        <slot></slot>
      </div>
    </NScrollbar>

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup></script>
