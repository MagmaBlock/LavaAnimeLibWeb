<template>
  <div
    class="bg-white dark:bg-zinc-800 opacity-90 px-4 py-2 flex space-x-4 items-center"
  >
    <n-icon size="32">
      <ErrorRound />
    </n-icon>
    <div class="text-xs sm:text-sm">
      此视频被标记为无法在浏览器中播放，画面、声音或字幕均可能异常。
      建议使用下方的第三方播放器或下载后进行播放。
    </div>
  </div>
</template>

<script setup>
import { ErrorRound } from "@vicons/material";
</script>
