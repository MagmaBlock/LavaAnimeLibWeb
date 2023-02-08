<script>
import AnimeCard from '../AnimeCard/AnimeCard.vue';
import ShowMoreButton from './ShowMoreButton.vue'

export default {
  data() {
    return {
      page: null
    };
  },
  props: {
    animes: Array, // 请传入一个包含动画信息的数组，数组中的每个对象均有 AnimeCard 所需的参数
    size: String, // 决定屏幕宽度  目前有 full large half
    fakeNumber: { type: Number, default: 18 }, // 未加载情况下显示多少个骨架卡片
    loading: Boolean // 决定是否显示为加载状态
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
        case "half": return this.halfClass;
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
    halfClass() {
      return `grid grid-cols-3 gap-2
        sm:grid-cols-4
        md:grid-cols-5
        lg:grid-cols-3 lg:gap-4
        xl:grid-cols-4
        2xl:grid-cols-5
      `
    }
  },
  components: { ShowMoreButton, AnimeCard }
}
</script>

<template>
  <div class="select-none w-full">
    <n-spin :show="!animes || loading" class="w-full">
      <div :class="autoGroupClass" class="w-full">
        <!-- 骨架屏 -->
        <template v-if="!animes" v-for="a in fakeNumber">
          <AnimeCard></AnimeCard>
        </template>
        <!-- 番剧卡片 -->
        <template v-for="(anime, index) in animes">
          <AnimeCard class="self-start" :anime="anime" v-if="index <= page" />
        </template>
      </div>
      <ShowMoreButton v-if="animes?.length > page" @click="page = page + 30" />
      <n-empty size="large" description="太可惜了，什么也没找到" class="py-16" v-if="animes?.length == 0">
      </n-empty>
    </n-spin>
  </div>
</template>
