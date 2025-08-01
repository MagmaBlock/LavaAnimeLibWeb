<template>
  <div class="flex max-w-[2560px] mx-auto">
    <!-- 导航栏 -->
    <NavBar class="fixed h-screen z-50" />
    <!-- 当前路由的界面 -->
    <!-- 手机端: 自动添加底部 padding; 宽屏: 自动添加导航栏宽度的左 padding -->
    <NScrollbar class="h-screen mx-auto">
      <div class="pb-36 lg:pb-0 lg:pl-[84px]">
        <NuxtPage />
      </div>
    </NScrollbar>

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
</template>

<script lang="ts" setup>
import { useThrottleFn } from "@vueuse/core";

// 以下内容用做前端防止未登录用户访问界面的情况
const router = useRouter();
const userStore = useUserStore();

// 创建一个节流函数，1 秒内最多执行一次
const throttledGetUserInfo = useThrottleFn(() => {
  // 仅在未登录时获取用户信息
  if (Object.keys(userStore.userInfo).length === 0) {
    userStore.getUserInfo();
  }
}, 1000);

onMounted(() => {
  throttledGetUserInfo();

  watch(
    () => router.currentRoute.value.path,
    () => {
      throttledGetUserInfo();
    }
  );
});
</script>
