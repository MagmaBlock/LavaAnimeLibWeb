<template>
  <div class="flex max-w-[2560px] mx-auto">
    <!-- 当前路由的界面 -->
    <!-- 手机端: 自动添加底部 padding; 宽屏: 自动添加导航栏宽度的左 padding -->
    <NScrollbar class="h-screen mx-auto">
      <div class="h-full grid place-items-center my-16 px-6">
        <div class="max-w-md flex flex-col gap-4">
          <!-- 中间的框 -->
          <NuxtPage class="shadow-lg" />
          <NCard title="本站目前仅登录可用且为邀请制" class="shadow-lg">
            本站为个人开发，且并非盈利性质，在 2021
            年创立之初仅计划面向个人和朋友间使用。为避免公开访问造成的资源盗链和不可控，目前采用白名单制，注册需要邀请码。
            <br /><br />
            您可通过 QQ 群、Bangumi 站内私信等方式联系 Magma。
          </NCard>
          <NFlex>
            <NButton secondary class="backdrop-blur-lg backdrop-brightness-75">
              <a
                href="https://unsplash.com/photos/brown-wooden-bench-near-train-rail-during-daytime-OW5F_DMfb0E"
                target="_blank"
                rel="noopener noreferrer"
              >
                本期背景：Unsplash 上的 @kivvii
              </a>
            </NButton>
          </NFlex>
        </div>
      </div>
    </NScrollbar>

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
</template>

<script setup lang="ts">
const background = useBackgroundStore();

background.setBackground("/login-background.jpg");

onUnmounted(() => {
  background.resetBackground();
});
</script>
