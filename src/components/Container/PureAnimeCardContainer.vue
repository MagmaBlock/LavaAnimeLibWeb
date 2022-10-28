<script>
export default {
  data() {
    return {
      page: null
    }
  },
  props: {
    animes: Array,
    childClass: [Array, String],
    fatherClass: [Array, String],
  },
  watch: {
    animes(newList, oldList) {
      this.page = 29 // 30 个
    }
  }
}
</script>
  
<template>
  <div :class="fatherClass">
    <!-- 番剧卡片骨架屏 -->
    <template v-for="a in 18" v-if="!animes">
      <AnimeCard fake class="animate-pulse" :class="childClass"></AnimeCard>
    </template>
    <!-- 番剧卡片 -->
    <template v-for="(anime, index) in animes">
      <template v-if="index <= page">
        <AnimeCard :id="anime.id" :poster="anime.images.poster" :title="anime.title" :bgmid="anime.bgmId"
          :views="anime.views" :bdrip="anime.type.bdrip" :nsfw="anime.type.nsfw" :class="childClass" />
      </template>
    </template>
  </div>
  <!-- 展示更多 -->
  <div v-if="Array.isArray(animes) && animes.length > page" @click="page = page + 30">
    <ShowMoreButton />
  </div>
  <!-- 空状态 -->
  <n-empty size="large" description="太可惜了，什么也没找到" class="py-16" v-if="Array.isArray(animes) && animes.length == 0">
  </n-empty>
</template>
  