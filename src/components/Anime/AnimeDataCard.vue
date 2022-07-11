<script>
export default {
  props: {
    la: {
      type: Object
    },
    bgm: {
      type: Object
    }
  },
  data() {
    return {
      showMore: false
    }
  }
}

</script>

<template>
  <div class="ease-in duration-200 shadow hover:shadow-lg w-full bg-white opacity-90 rounded-md">
    <!-- 面包屑导航 但是不能点 -->
    <div class="px-4 py-2 text-sm text-gray-500 border-b-[1px]">
      {{ this.la.year }}
      <i class="bi bi-chevron-right text-xs align-middle"></i>
      {{ this.la.type }}
      <i class="bi bi-chevron-right text-xs align-middle"></i>
      {{ this.la.name }}
    </div>
    <!-- 主信息卡 -->
    <div class="py-3 px-4">
      <!-- 标题块 -->
      <div class="text-2xl pb-0.5">
        {{ this.la.title }}
        <span class="text-sm" v-if="this.bgm">{{ this.bgm.platform }}</span>
        <div class="text-sm leading-5 text-gray-500" v-if="this.bgm">{{ this.bgm.name }}</div>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 font-light text-base leading-5 text-gray-600">
        <!-- 第一行 -->
        <div>
          <span class="mr-2"><i class="bi bi-play-btn"></i> 播放 {{ this.la.views }} 次</span>
          <div class="mr-2 my-1" v-if="!this.bgm">本作是 Bangumi 未收录番剧，或者可能根本不是一个影视作品</div>
          <span class="mr-2" v-if="this.bgm"><i class="bi bi-star"></i> {{ this.bgm.rating.score }} 分
            <n-tag size="small" :bordered="false" v-if="this.bgm.rating.rank" class="align-text-top font-normal">
              Rank.#{{ this.bgm.rating.rank }}
            </n-tag>
          </span>
        </div>
        <!-- 第二行 -->
        <div v-if="this.bgm">
          <span class="mr-2"><i class="bi bi-calendar-event"></i> {{ this.bgm.date || '未来' }} 开始放送</span>
          <span class="mr-2"><i class="bi bi-collection"></i> {{ this.bgm.eps }} 话</span>
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 overflow-clip" v-if="this.bgm">
        <span v-for="(tag, index) in this.bgm.tags">
          <!-- 前 20 个标签 -->
          <n-tag size="small" class="mr-1 mb-1" :bordered="false" v-if="index <= this.bgm.tags.length / 3">
            {{ tag.name }} {{ tag.count }}
          </n-tag>
          <!-- 隐藏的标签 -->
          <span class="ease-in duration-300" :class="showMore ? '' : 'absolute opacity-0 w-0 overflow-hidden'">
            <n-tag size="small" class="mr-1 mb-1" :bordered="false" v-if="index > this.bgm.tags.length / 3">
              {{ tag.name }} {{ tag.count }}
            </n-tag>
          </span>
        </span>
        <span>
          <n-tag size="small" class="mr-1 mb-1 text-gray-300" :bordered="false" @click="showMore = !showMore" checkable>
            {{ showMore ? '收起' : '展开' }}
          </n-tag>
        </span>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <a :href="'https://bgm.tv/subject/' + this.la.bgmid" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
        </a>
      </div>
    </div>
  </div>
</template>