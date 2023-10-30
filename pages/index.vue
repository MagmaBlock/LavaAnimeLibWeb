<template>
  <ContainerPageMobileFull>
    <!-- 浏览器升级提示 -->
    <div
      v-if="notSupport"
      class="bg-orange-100 dark:bg-orange-950 p-4 text-xs lg:rounded lg:mb-4 select-all"
    >
      当前浏览器内核 {{ ua.getEngine().name }}
      {{ ua.getEngine().version }} 过旧，界面样式和功能可能发生异常。<br />
      我们建议使用 2021 年后的浏览器内核. Chrome / Edge > 84, FireFox > 100,
      Safari > 15.6。番剧库最低保证在 Blink 71 能够显示出界面。
    </div>
    <!-- 主页 -->
    <div class="lg:flex mb-4">
      <HomeHeaderPicture
        class="lg:basis-1/2 xl:basis-2/5 sm:rounded lg:mr-4"
      />
      <div
        class="lg:basis-1/2 xl:basis-3/5 px-6 py-4 bg-gray-50 dark:bg-zinc-800 rounded hidden lg:block"
      >
        <div class="text-xl">最近更新</div>
        <div class="text-sm text-gray-500 mb-2">预留</div>
      </div>
    </div>
    <HomeCollection />
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
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
