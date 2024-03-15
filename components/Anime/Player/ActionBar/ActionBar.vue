<template>
  <NCollapseTransition :show="store.activeFile?.url !== undefined">
    <NCard size="small" :bordered="false" class="select-none overflow-hidden">
      <!-- 浏览器无法播放部分视频的警告 -->
      <AnimeNoBrowserNotice v-if="store.isNoBrowser" class="mb-2" />
      <!-- 操作栏部分 -->
      <NScrollbar x-scrollable>
        <div class="flex flex-nowrap flex-shrink-0 gap-1 md:gap-2">
          <AnimePlayerActionBarIcons ref="icons">
            <template #showAll>
              <!-- 展开全部 -->
              <AnimePlayerActionBarIcon
                class="mr-2"
                @click="
                  pausePlayer();
                  moreModel = true;
                "
              >
                <i class="bi bi-three-dots"></i>
              </AnimePlayerActionBarIcon>
            </template>
          </AnimePlayerActionBarIcons>
        </div>
      </NScrollbar>
      <!-- Model 模态框 -->
      <NModal v-model:show="moreModel" class="h-fit select-none">
        <NCard
          class="max-w-xl"
          title="全部播放器"
          :bordered="false"
          size="small"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra>
            <i
              class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2"
              @click="moreModel = false"
            ></i>
          </template>
          <div class="flex flex-wrap gap-1 md:gap-2 mb-4">
            <AnimePlayerActionBarIcons :allos="true" />
          </div>
          <div class="text-gray-600 dark:text-gray-400 text-xs">
            番剧库会根据您使用的设备，判断支持的外部播放器。<br />而这里是所有设备可用的播放器，它们可能不支持您的设备。<br />
          </div>
          <NuxtLink
            to="/help?article=WhyExternalPlayer"
            class="text-blue-500 text-xs block mt-2"
          >
            部分视频提示 “需要外部播放器”？
          </NuxtLink>
          <NuxtLink
            to="/help?article=ExternalPlayerList"
            class="text-blue-500 text-xs block"
          >
            可用的外部播放器列表
          </NuxtLink>
          <div class="text-gray-600 dark:text-gray-400 text-xs mt-2">
            图标绘制：Arthals
          </div>
        </NCard>
      </NModal>
    </NCard>
  </NCollapseTransition>
</template>

<script setup>
const store = useAnimeStore();
const moreModel = ref(false);

function pausePlayer() {
  store?.artInstance?.pause();
}
</script>
