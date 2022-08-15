<script>
import axios from 'axios'
import config from '../common/config';
import { LavaAnimeAPI } from '../common/api'

import AnimeCard from '../components/AnimeCard.vue';
import Container from '../components/Container.vue';

export default {
  props: ['memory'],
  data() {
    return {
      tabs: { year: [], type: [] },
      animes: [],
      animeCardsClass: '',
      loading: {
        year: true,
        type: true,
        anime: true
      },
      justOpen: true
    }
  },
  methods: {
    async getIndex() {
      let index = (await LavaAnimeAPI('/v2/index/info')).data
      if (index.code == 200) index = index.data
      else throw new Error('索引获取失败')
      this.tabs = index
      this.loading.year = false // 动画
      this.loading.type = false
    },
    async onTagClick(tagName, type) {
      if (this.memory.selectedTab[type] == tagName) { // 点击的标签已经被选择
        if (this.isMemoryJustToBeEmpty()) return // 当筛选条件已剩最后一个，禁止继续取消
        else this.memory.selectedTab[type] = '' // 取消当前筛选条件
      } else { // 点击的标签未被选择
        this.memory.selectedTab[type] = tagName // 将其选择
      }
      await this.queryIndex()
    },
    async queryIndex() { // 用 this.memory.selectedTab 的值来查询索引
      this.loading.anime = true
      this.animeCardsClass = 'hidden'
      let animeList = (await LavaAnimeAPI.post('/v2/index/query', this.memory.selectedTab)).data.data
      this.animes = animeList // 更新列表
      await new Promise(resolve => { setTimeout(() => { resolve() }, 200); }) // 慢一点切换以便展示动画
      this.animeCardsClass = ''
      this.loading.anime = false
    },
    isMemoryJustToBeEmpty() {
      let selectedTab = this.memory.selectedTab // 当前所有被选中的条件
      let trueKeys = 0 // 仍然激活的条件类型
      for (let i in selectedTab) {
        if (selectedTab[i]) trueKeys++ // 发现一个被激活的条件类型
      }
      if (trueKeys >= 2) return false // 如果两个及以上被选中，允许取消
      else return true // 如果只剩一个被选中，禁止取消
    }
  },
  async mounted() {
    this.getIndex()
    this.queryIndex()
  }
}
</script>

<template>
  <Container>
    <div class="lg:flex lg:flex-row">

      <!-- 选项部分，在高宽度屏幕上将左右 Flex -->
      <div class="lg:basis-1/4 select-none">

        <div class="sticky top-5">

          <div class="text-lg mb-4 mx-0.5 font-medium">番剧索引</div>
          <!-- 年份部分 -->
          <n-spin :show="loading.year" class="mb-2">
            <!-- 年份骨架屏 -->
            <div class="leading-none" v-if="loading.year">
              <div class="inline-block w-[60px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 17"></div>
            </div>
            <!-- 年份内容 -->
            <n-tag v-if="!loading.year" v-for="yearName in tabs.year" @click="onTagClick(yearName, 'year')"
              :checked="memory.selectedTab.year == yearName" style="margin: 2px;" checkable>
              {{ yearName }}
            </n-tag>
          </n-spin>
          <n-divider class="hidden lg:block" />
          <!-- 分类部分 -->
          <n-spin :show="loading.type">
            <!-- 分类骨架屏 -->
            <div class="leading-none" v-if="loading.type">
              <div class="inline-block w-[50px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 4"></div>
            </div>
            <!-- 分类内容 -->
            <n-tag v-if="!loading.type" v-for="typeName in tabs.type" @click="onTagClick(typeName, 'type')"
              :checked="memory.selectedTab.type == typeName" style="margin: 2px;" checkable>
              {{ typeName }}
            </n-tag>
          </n-spin>
          <n-divider class="lg:hidden" />
        </div>
      </div>


      <!-- 番剧栅格部分 -->
      <div class="px-1 lg:basis-3/4 lg:ml-4 select-none">
        <n-spin :show="loading.anime">
          <div class="grid 
        grid-cols-3 gap-x-2
        sm:grid-cols-4 sm:gap-x-4
        md:grid-cols-5 md:gap-x-6
        lg:grid-cols-5
        xl:grid-cols-5
        2xl:grid-cols-6 2xl:px-10">
            <!-- 番剧卡片骨架屏 -->
            <div v-for="a in 16" v-if="loading.anime" class="mb-1">
              <AnimeCard fake></AnimeCard>
            </div>
            <!-- 番剧卡片 -->
            <div v-for="anime in animes" class="mb-1" :class="animeCardsClass">
              <AnimeCard :id="anime.id" :poster="anime.images.poster" :title="anime.title" :bgmid="anime.bgmId"
                :views="anime.views" :bdrip="anime.tags.bdrip" :nsfw="anime.tags.nsfw" />
            </div>
          </div>
        </n-spin>
      </div>
    </div>
  </Container>
</template>


<style>
</style>