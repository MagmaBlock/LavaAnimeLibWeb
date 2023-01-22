<template>
  <AnimeBasicCard class="select-none overflow-hidden relative">
    <!-- 未选择集数的遮罩 -->
    <div v-if="!video.url" class="absolute w-full h-full bg-white dark:bg-zinc-800 bg-opacity-90 dark:bg-opacity-90 z-10
    grid place-items-center">
      请先选择集数
    </div>
    <div class="flex flex-nowrap flex-shrink-0 overflow-x-scroll lg:overflow-auto p-2 gap-1 md:gap-2">
      <LocalPlayerIcons ref="icons" :player="player" :video="video">
        <template #showAll>
          <!-- 展开全部 -->
          <LocalPlayerIcon class="mr-2" @click="pausePlayer(); moreModel = true">
            <i class="bi bi-three-dots"></i>
          </LocalPlayerIcon>
        </template>
      </LocalPlayerIcons>
    </div>
    <!-- Model 模态框 -->
    <n-modal v-model:show="moreModel" class="h-fit select-none">
      <n-card :bordered="false" aria-modal="true" class="max-w-xl" role="dialog" size="small" title="全部播放器">
        <template #header-extra>
          <i class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2" @click="moreModel = false"></i>
        </template>
        <div class="flex flex-wrap gap-1 md:gap-2 mb-4">
          <LocalPlayerIcons :allos="true" :player="player" :video="video"/>
        </div>
        <div class="text-gray-600 dark:text-gray-400 text-xs">
          番剧库会根据您使用的设备，判断支持的外部播放器。<br>而这里是所有设备可用的播放器，它们可能不支持您的设备。<br>
        </div>
        <RouterLink class="text-blue-500 text-xs block mt-2" to="/help?article=WhyExternalPlayer">
          部分视频提示 “需要外部播放器”？
        </RouterLink>
        <RouterLink class="text-blue-500 text-xs block" to="/help?article=ExternalPlayerList">
          可用的外部播放器列表
        </RouterLink>
        <div class="text-gray-600 dark:text-gray-400 text-xs mt-2">
          图标绘制：Arthals
        </div>
      </n-card>
    </n-modal>
  </AnimeBasicCard>
</template>

<script>
import {ref} from 'vue';
import LocalPlayerIcon from './LocalPlayerIcon.vue';
import LocalPlayerIcons from './LocalPlayerIcons.vue';


export default {
  data() {
    return {
      moreModel: ref(false),
    };
  },
  props: {
    video: Object,
    player: Object
  },
  methods: {
    pausePlayer() {
      this.player.art.pause();
      console.log("暂停来自上级的播放器.");
    }
  },
  mounted() {
  },
  components: {LocalPlayerIcons, LocalPlayerIcon}
}
</script>