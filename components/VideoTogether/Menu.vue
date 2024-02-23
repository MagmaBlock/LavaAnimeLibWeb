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

    <NCollapse>
      <NCollapseItem title="如何使用？">
        <div>
          打开下方开关后，您应该能在浏览器右下角看到一个图标，点击打开。由房主设备创建一个房间，其他观众仅需同样在番剧库打开此功能后进入房间。从机会自动同步房主的浏览操作。建议您和其他观众连麦以获得更佳体验。
        </div>
      </NCollapseItem>
      <NCollapseItem title="播放时，非房主无法操作？">
        <div>这是正常现象，您的进度条会持续和主机同步。</div>
      </NCollapseItem>
      <NCollapseItem title="播放的话数/视频不同怎么办？">
        <div>
          由于技术实现原因，可能出现您和主机播放话数/视频不同的情况。请与主机沟通确保播放了同一个视频。
        </div>
      </NCollapseItem>
    </NCollapse>

    <template #action>
      <NSwitch v-model:value="isEnable" />
    </template>
  </NCard>
</template>

<script lang="ts" setup>
import { useStorage } from "@vueuse/core";

const isEnable = useStorage("enableVideoTogether", false);

watch(isEnable, () => {
  if (isEnable.value === false) {
    const router = useRouter();
    router.go(0);
  }
});
</script>
