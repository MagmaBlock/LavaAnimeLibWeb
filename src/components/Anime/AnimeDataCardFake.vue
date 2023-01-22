<script>
export default {
  data() {
    return {}
  }
}

</script>

<template>
  <AnimeBasicCard>
    <!-- 面包屑导航 但是不能点 -->
    <div class="px-4 py-2 text-sm text-gray-500 border-b-[1px]">
      <n-skeleton text></n-skeleton>
    </div>
    <!-- 主信息卡 -->
    <div class="py-3 px-4">
      <!-- 标题块 -->
      <div class="mb-1">
        <n-skeleton :height="28" :width="256"></n-skeleton>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2"><i class="bi bi-play-btn"></i> 播放 ... 次</span>
          <span class="mr-2"><i class="bi bi-star"></i> ... 分
            <span
                class="bg-gray-100 text-black dark:bg-zinc-700 dark:text-zinc-200 rounded-sm px-1.5 text-xs align-baseline">
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
        <template v-for="a in 15">
          <n-skeleton :height="22" :sharp="false" :width="40 + (50 - a) * Math.random()"
                      class="inline-block mr-1 mb-"></n-skeleton>
        </template>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
      </div>
    </div>
  </AnimeBasicCard>
</template>