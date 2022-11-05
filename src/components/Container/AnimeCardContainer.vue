<script>
import ShowMoreButton from './ShowMoreButton.vue'

export default {
  data() {
    return {
      page: null
    };
  },
  props: {
    animes: Array, // 请传入一个包含动画信息的数组，数组中的每个对象均有 AnimeCard 所需的参数
    size: String // 决定屏幕宽度  目前有 full large 
  },
  watch: {
    animes(newList, oldList) {
      this.page = 29; // 30 个
    }
  },
  mounted() {
    this.page = 29;
  },
  computed: {
    autoGroupClass() {
      switch (this.size) {
        case "full": return this.fullClass;
        case "large": return this.largeClass;
        default: return "";
      }
    },
    fullClass() {
      return `grid grid-cols-3 gap-2
        sm:grid-cols-4 sm:gap-x-4
        md:grid-cols-5 md:gap-x-6
        lg:grid-cols-7
        xl:grid-cols-8
        2xl:grid-cols-10`;
    },
    largeClass() {
      return `grid grid-cols-3 gap-2
        sm:grid-cols-4 sm:gap-x-4
        md:grid-cols-5 md:gap-x-6
        lg:grid-cols-5
        xl:grid-cols-5
        2xl:grid-cols-6 2xl:px-10`;
    },
    halfClass() { }
  },
  components: { ShowMoreButton }
}
</script>

<template>
  <!-- 番剧栅格部分 -->
  <div class="select-none">
    <n-spin :show="!animes">
      <div :class="autoGroupClass">
        <!-- 番剧卡片骨架屏 -->
        <div v-for="a in 18" v-if="!animes">
          <AnimeCard fake class="animate-pulse"></AnimeCard>
        </div>
        <!-- 番剧卡片 -->
        <template v-for="(anime, index) in animes">
          <template v-if="index <= page">
            <AnimeCard :id="anime.id" :poster="anime.images.poster" :title="anime.title" :bgmid="anime.bgmId"
              :views="anime.views" :bdrip="anime.type.bdrip" :nsfw="anime.type.nsfw" />
          </template>
        </template>
      </div>
      <div v-if="Array.isArray(animes) && animes.length > page" @click="page = page + 30">
        <ShowMoreButton />
      </div>
      <n-empty size="large" description="太可惜了，什么也没找到" class="py-16" v-if="Array.isArray(animes) && animes.length == 0">
      </n-empty>
    </n-spin>
  </div>
</template>
