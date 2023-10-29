<template>
  <div class="h-full grid place-items-center mt-16">
    <div class="max-w-md">
      <!-- 中间的框 -->
      <NuxtPage class="shadow-lg" />
      <NCard title="本站目前仅登录可用且为邀请制" class="mt-4 shadow-lg">
        本站为个人开发，且并非盈利性质，在 2021
        年创立之初仅计划面向个人和朋友间使用。为避免公开访问造成的资源盗链和不可控，目前采用白名单制，注册需要邀请码。
        <br /><br />
        您可通过 QQ 群、Bangumi 站内私信等方式联系 Magma。
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const background = useBackgroundStore();

background.setBackground(
  "https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1559239115-ce3eb7cb87ea?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=invictus-tailoring-sneaker-socks-5OZgVj0YVwQ-unsplash.jpg&w=1920"
);

onUnmounted(() => {
  background.resetBackground();
});
</script>
