<script>

export default {
  props: {
    id: {
      type: [String, Number]
    },
    poster: {
      type: String,
      default: 'https://anime-img.5t5.top/assets/noposter.png'
    },
    title: {
      type: String,
      default: '番剧标题'
    },
    bgmid: [String, Number],
    views: {
      type: Number,
      default: 0
    },
    nsfw: [Boolean],
    bdrip: [Boolean],
    relation: String,
    fake: {
      type: Boolean,
      default: false
    },
  },
  methods: {},
  data() {
    return {}
  }
}
</script>

<template>
  <div>

    <!-- 正常 -->
    <div class="p-1" v-if="!this.fake">
      <RouterLink :to="'/anime/' + this.id">
        <!-- 海报 -->
        <img :src="poster" class="inline-block border border-gray-100 rounded-md w-full aspect-[2/3]" alt="封面图片">
        <!-- 标题 -->
        <div class="text-[13px] leading-[18px] h-9 my-1 break-words">
          <n-ellipsis :line-clamp="2" expand-trigger="hover">
            <span class="bg-gray-200 p-1 rounded" v-if="relation">{{ relation }}</span>
            {{ title }}
            <!-- Special Tags -->
            <div v-if="bdrip"
              class="inline-block bg-blue-100 text-xs text-blue-600 font-medium rounded-sm px-1.5 ml-0.5">
              BDRip
            </div>
            <div v-if="nsfw"
              class="inline-block bg-yellow-100 text-xs text-yellow-600 font-medium rounded-sm px-1.5 ml-0.5">NSFW</div>
          </n-ellipsis>
        </div>
      </RouterLink>

      <!-- 信息区 -->
      <div class="text-xs leading-[18px] text-gray-500">
        <div><i class="bi bi-play-btn"></i> {{ views }} 播放</div>
        <a v-if="parseInt(bgmid)" :href="'https://bgm.tv/subject/' + bgmid" target="_blank">
          <i class="bi bi-link-45deg"></i> 番组计划</a>
      </div>
    </div>

    <!-- 骨架部分 -->
    <div class="p-1" v-if="this.fake">
      <div class="rounded-md w-full mb-0 bg-gray-300 animate-pulse aspect-[46/65]"></div>

      <div class="text-[13px] leading-[18px] h-9 my-1 break-words">
        <div class="w-full h-[14px] mt-1 bg-gray-300 animate-pulse"></div>
      </div>

      <div class="text-xs leading-[18px] text-gray-500">
        <div class="w-12 h-[14px] mt-1 bg-gray-300 animate-pulse"></div>
        <div class="w-14 h-[14px] mt-1 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>