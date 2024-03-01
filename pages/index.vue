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
              App ready to work offline
            </span>
            <span v-else>
              New content available, click on reload button to update.
            </span>
          </div>
          <button
            v-if="$pwa.needRefresh"
            @click="$pwa.updateServiceWorker()"
          >
            Reload
          </button>
          <button @click="$pwa.cancelPrompt()">
            Close
          </button>
        </div>
        <div
          v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
          class="pwa-toast"
          role="alert"
        >
          <div class="message">
            <span>
              Install PWA
            </span>
          </div>
          <button @click="$pwa.install()">
            Install
          </button>
          <button @click="$pwa.cancelInstall()">
            Cancel
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
