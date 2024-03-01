<template>
  <ContainerPageMobileFull>
    <!-- 浏览器升级提示 -->
    <div
      v-if="notSupport"
      class="bg-orange-100 dark:bg-orange-950 p-4 text-xs lg:rounded-md lg:mb-4 select-all"
    >
      当前浏览器内核 {{ ua.getEngine().name }}
      {{ ua.getEngine().version }} 过旧，界面样式和功能可能发生异常。<br />
      我们建议使用 2021 年后的浏览器内核. Chrome / Edge > 84, FireFox > 100,
      Safari > 15.6。番剧库最低保证在 Blink 71 能够显示出界面。
    </div>
    <!-- 主页 -->
    <HomeRecentUpdate />
    <HomeCollection />
  </ContainerPageMobileFull>
  <ClientOnly>
        <div
          v-if="$pwa?.offlineReady || $pwa?.needRefresh"
          class="pwa-toast"
          role="alert"
        >
          <div class="message">
            <span v-if="$pwa.offlineReady">
              熔岩番剧库现已离线可用
            </span>
            <span v-else>
              有新的熔岩番剧库更新可用.
            </span>
          </div>
          <button
            v-if="$pwa.needRefresh"
            @click="$pwa.updateServiceWorker()"
          >
            刷新
          </button>
          <button @click="$pwa.cancelPrompt()">
            关闭
          </button>
        </div>
        <div
          v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
          class="pwa-toast"
          role="alert"
        >
          <div class="message">
            <span>
              安装熔岩番剧库
            </span>
          </div>
          <button @click="$pwa.install()">
            安装
          </button>
          <button @click="$pwa.cancelInstall()">
            取消
          </button>
        </div>
      </ClientOnly>
</template>

<script setup lang="ts">
useHead({ title: "首页" });

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
<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}

.pwa-toast .message {
  margin-bottom: 8px;
}

.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
