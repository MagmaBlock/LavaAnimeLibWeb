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
    <div class="absolute inset-y-0 inset-x-0 overflow-hidden -z-50">
      <Transition
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
      >
        <img
          class="w-full h-full scale-110 object-cover dark:brightness-50"
          :class="background.customClass"
          :src="background.imageUrl"
          alt="背景图片"
          v-show="background.enable"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
const background = useBackgroundStore();

useHeadSafe({
  bodyAttrs: {
    class:
      "bg-white dark:bg-[#101014] text-gray-800 dark:text-zinc-200 select-none",
  },
});
</script>
