<script>
import AnimeBasicCard from "./Cards/AnimeBasicCard.vue";

export default {
  props: {
    la: {
      type: Object,
    },
  },
  data() {
    return {
      showMore: false,
    };
  },
  components: { AnimeBasicCard },
};
</script>

<template>
  <AnimeBasicCard class="select-text">
    <!-- 面包屑导航 但是不能点 -->
    <div class="px-4 py-2 text-sm text-gray-500 border-b dark:border-zinc-700">
      <RouterLink :to="{ name: 'Index' }">
        {{ this.la.index.year }}
        <i class="bi bi-chevron-right text-xs"></i>
        {{ this.la.index.type }}
        <i class="bi bi-chevron-right text-xs"></i>
      </RouterLink>
      {{ this.la.index.name }}
    </div>
    <!-- 主信息卡 -->
    <div class="py-3 px-4">
      <!-- 标题块 -->
      <div class="mb-1">
        <div class="text-xl inline-block mr-2">
          {{ this.la.title }}
          <span class="text-base"
            >({{ this.la.index.year.replace("年", "") }})</span
          >
        </div>
        <div
          class="text-sm leading-5 text-gray-500 inline-block"
          v-if="this.la.bgmId"
        >
          {{ this.la.name }} · {{ this.la.platform }}
        </div>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2"
            ><i class="bi bi-play-btn"></i> 播放 {{ this.la.views }} 次</span
          >
          <div class="mr-2 my-1" v-if="!this.la.bgmId">
            本作是 Bangumi 未收录番剧，或者可能根本不是一个影视作品
          </div>
          <span class="mr-2" v-if="this.la.bgmId"
            ><i class="bi bi-star"></i> {{ this.la.rating.score }} 分
            <span
              v-if="this.la.rating.rank"
              class="bg-gray-100 text-black dark:bg-zinc-700 dark:text-zinc-200 rounded-sm px-1.5 text-xs align-baseline"
            >
              Rank.#{{ this.la.rating.rank }}
            </span>
          </span>
        </div>
        <!-- 第二行 -->
        <div v-if="this.la.bgmId" class="inline-block">
          <span class="mr-2"
            ><i class="bi bi-calendar-event"></i>
            {{ this.la.date || "未来" }} 开始放送</span
          >
          <span class="mr-2"
            ><i class="bi bi-collection"></i> {{ this.la.eps }} 话</span
          >
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 flex flex-wrap" v-if="this.la.bgmId">
        <TransitionGroup
          enter-active-class="animate__animated animate__zoomIn animate__faster"
          leave-active-class="animate__animated animate__zoomOut animate__faster"
        >
          <template v-for="(tag, index) in this.la.tags" :key="index">
            <n-tag
              size="small"
              class="mr-1 mb-1 flex-initial max-w-xs overflow-hidden"
              :bordered="false"
              v-show="index <= this.la.tags.length / 3 || showMore"
            >
              {{ tag.name }} {{ tag.count }}
            </n-tag>
          </template>
        </TransitionGroup>
        <span>
          <n-tag
            size="small"
            class="mr-1 mb-1 text-gray-300 dark:text-zinc-200"
            :bordered="false"
            @click="showMore = !showMore"
            checkable
          >
            {{ showMore ? "收起" : "展开" }}
          </n-tag>
        </span>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <a :href="'https://bgm.tv/subject/' + this.la.bgmId" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
        </a>
      </div>
    </div>
  </AnimeBasicCard>
</template>
