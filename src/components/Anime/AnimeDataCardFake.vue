<script>
export default {
  data() {
    return {

    }
  }
}

</script>

<template>
  <AnimeBasicCard>
    <!-- 面包屑导航 但是不能点 -->
    <div class="px-4 py-2 text-sm text-gray-500 border-b-[1px]">
      <span class="bg-gray-300 text-gray-300 animate-pulse">2022年</span>
      <i class="bi bi-chevron-right text-xs align-middle"></i>
      <span class="bg-gray-300 text-gray-300 animate-pulse">1月冬</span>
      <i class="bi bi-chevron-right text-xs align-middle"></i>
      <span class="bg-gray-300 text-gray-300 animate-pulse">番剧名番剧名番剧名番剧名</span>
    </div>
    <!-- 主信息卡 -->
    <div class="py-3 px-4">
      <!-- 标题块 -->
      <div class="mb-1">
        <div class="text-xl inline-block mr-2">
          <span class="bg-gray-300 text-gray-300 animate-pulse">啊啊啊啊啊啊啊啊啊</span>
          <span class="text-base bg-gray-300 text-gray-300 animate-pulse">(2022)</span>
        </div>
        <div class="text-sm leading-5 text-gray-500 inline-block">
          <span class="bg-gray-300 text-gray-300 animate-pulse">
            啊啊啊啊啊啊啊啊啊啊 · TV
          </span>
        </div>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2"><i class="bi bi-play-btn"></i> 播放 ... 次</span>
          <span class="mr-2"><i class="bi bi-star"></i> ... 分
            <span class="bg-gray-100 text-black rounded-sm px-1.5 text-xs align-baseline">
              Rank.#...
            </span>
          </span>
        </div>
        <!-- 第二行 -->
        <div class="inline-block">
          <span class="mr-2"><i class="bi bi-calendar-event"></i> ... 开始放送</span>
          <span class="mr-2"><i class="bi bi-collection"></i> ... 话</span>
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 overflow-clip">
        <span v-for="a in 15">
          <n-tag size="small" class="mr-1 mb-1" :bordered="false">
            <span class="bg-gray-300 text-gray-300 animate-pulse">{{ (20 - a) * 10000 }}</span>
          </n-tag>
        </span>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
      </div>
    </div>
  </AnimeBasicCard>
</template>