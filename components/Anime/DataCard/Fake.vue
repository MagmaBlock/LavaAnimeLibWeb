<template>
  <AnimeCardBasic>
    <!-- 面包屑导航 但是不能点 -->
    <div class="pb-2 text-sm text-gray-500">
      <NSkeleton text></NSkeleton>
    </div>
    <!-- 主信息卡 -->
    <div class="pt-2">
      <!-- 标题块 -->
      <div class="mb-1">
        <NSkeleton :height="28" :width="256"></NSkeleton>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2"><i class="bi bi-play-btn"></i> 播放 ... 次</span>
          <span class="mr-2"
            ><i class="bi bi-star"></i> ... 分
            <span
              class="bg-gray-100 text-black dark:bg-zinc-700 dark:text-zinc-200 rounded-md px-1.5 text-xs align-baseline"
            >
              Rank.#...
            </span>
          </span>
        </div>
        <!-- 第二行 -->
        <div class="inline-block">
          <span class="mr-2"
            ><i class="bi bi-calendar-event"></i> ... 开始放送</span
          >
          <span class="mr-2"><i class="bi bi-collection"></i> ... 话</span>
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 overflow-clip">
        <template v-for="a in 15">
          <NSkeleton
            class="inline-block mr-1 mb-"
            :height="22"
            :width="40 + (50 - a) * Math.random()"
            :sharp="false"
          ></NSkeleton>
        </template>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
      </div>
    </div>
  </AnimeCardBasic>
</template>
