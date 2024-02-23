<template></template>

<script lang="ts" setup>
import { useScriptTag, useStorage } from "@vueuse/core";

// 一起看相关脚本处理
const { scriptTag, load, unload } = useScriptTag(
  "https://2gether.video/release/extension.website.user.js",
  () => {
    // do something
  },
  { manual: true }
);

const enableVideoTogether = useStorage("enableVideoTogether", false);

// 监听 localstorage 存储事件
watch(enableVideoTogether, applyVideoTogether);

applyVideoTogether();

async function applyVideoTogether() {
  if (enableVideoTogether.value) {
    await load();
  }
}
</script>
