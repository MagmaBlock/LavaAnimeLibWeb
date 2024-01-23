<template>
  <NCard title="一起看视频" :bordered="false" embedded>
    <template #header-extra>
      <NSpace size="small">
        <NA href="https://videotogether.github.io/zh-cn/" target="_blank">
          VideoTogether
        </NA>
        提供技术支持
      </NSpace>
    </template>

    <NP>
      您可以使用此功能与其他番剧库用户一起观看视频。<br />
      在右下角悬浮窗中创建房间，并与其他用户分享您的房间。
    </NP>

    <template #action>
      <NSwitch v-model:value="isEnable" />
    </template>
  </NCard>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { watch } from "vue";

const isEnable = useStorage("enableVideoTogether", false);

watch(isEnable, () => {
  if (isEnable.value === false) {
    $message.info("将在下次刷新界面后关闭");
  }
});
</script>
