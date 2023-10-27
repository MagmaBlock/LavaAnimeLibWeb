<script setup>
import { useElementVisibility } from "@vueuse/core";

const props = defineProps({
  animes: Array, // 请传入一个包含动画信息的数组，数组中的每个对象均有 AnimeCard 所需的参数
  size: String, // 决定屏幕宽度  目前有 full large half alwaysMobile
  fakeNumber: { type: Number, default: 18 }, // 未加载情况下显示多少个骨架卡片
  loading: Boolean, // 决定是否显示为加载状态
});

// 展示的卡片数量
const page = ref(29);
// 每次动画列表更换后, 重置展示数量
watch(
  () => props.animes,
  () => {
    page.value = 29;
  }
);

const autoGroupClass = computed(() => {
  return {
    // 满屏
    full: "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 md:gap-x-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10",
    // 半屏以上
    large:
      "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    // 半屏
    half: "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5",
    // 半屏以下
    small:
      "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3",
    // 总是 3 个
    alwaysMobile: "grid grid-cols-3 gap-3 sm:grid-cols-3",
  }[props.size];
});

const target = ref(null);
const visible = useElementVisibility(target);
</script>

<template>
  <div class="select-none w-full" ref="target">
    <NSpin :show="visible && (loading || !animes)" class="w-full">
      <div :class="autoGroupClass" class="w-full">
        <!-- 骨架屏 -->
        <template v-if="!animes" v-for="a in fakeNumber">
          <AnimeCard />
        </template>
        <!-- 番剧卡片 -->
        <template v-for="(anime, index) in animes">
          <AnimeCard class="self-start" :anime="anime" v-if="index <= page" />
        </template>
      </div>
    </NSpin>
    <UniListShowMore
      v-if="animes?.length > page + 1"
      @click="page = page + 30"
    />
    <NEmpty
      size="large"
      description="太可惜了，什么也没找到"
      class="py-16"
      v-if="animes?.length == 0"
    >
    </NEmpty>
  </div>
</template>
