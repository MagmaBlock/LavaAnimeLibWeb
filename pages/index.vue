<template>
  <ContainerPageMobileFull>
    <!-- 浏览器升级提示 -->
    <div v-if="notSupport" class="bg-orange-100 dark:bg-orange-950 p-4 text-xs lg:rounded-md lg:mb-4 select-all">
      当前浏览器内核 {{ ua.getEngine().name }}
      {{ ua.getEngine().version }} 过旧，界面样式和功能可能发生异常。<br />
      我们建议使用 2021 年后的浏览器内核. Chrome / Edge > 84, FireFox > 100,
      Safari > 15.6。番剧库最低保证在 Blink 71 能够显示出界面。
    </div>
    <!-- 主页 -->
    <HomeRecentUpdate />
    <HomeCollection />
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

useHead({ title: "首页" });

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 检查用户是否登录
if (Object.keys(userInfo.value).length === 0) {
  await navigateTo("/auth/login");
}

import uaParser from "ua-parser-js";

const ua = new uaParser();
const notSupport = ref(false);

if (
  ua.getEngine().name == "Blink" &&
  Number.parseInt(ua.getEngine().version ?? "0") < 84
) {
  notSupport.value = true;
}
</script>
