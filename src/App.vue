<script setup>
import View from "./views/View.vue";
import ThemeProvier from "./components/ThemeProvier.vue";
import { useScriptTag, useStorage } from "@vueuse/core";
import { watch } from "vue";

// 一起看相关脚本处理
const { scriptTag, load, unload } = useScriptTag(
  "https://2gether.video/release/extension.website.user.js",
  () => {
    // do something
  },
  { manual: true }
);

const enableVideoTogether = useStorage("enableVideoTogether", false);

watch(enableVideoTogether, applyVideoTogether);

applyVideoTogether();

async function applyVideoTogether() {
  if (enableVideoTogether.value) {
    await load();
  }
}
</script>

<template>
  <ThemeProvier>
    <n-notification-provider>
      <n-message-provider>
        <View />
      </n-message-provider>
    </n-notification-provider>
  </ThemeProvier>
</template>
