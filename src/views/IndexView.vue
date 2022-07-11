<script>
import axios from 'axios'
import config from '../assets/config';

import AnimeCard from '../components/AnimeCard.vue';
import Container from '../components/Container.vue';

export default {
  props: ['memory'],
  data() {
    return {
      tabs: { years: [], types: [] },
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
    async getYear() { // 获取年份列表，一般只在打开界面时自动获取
      this.tabs.years = (await axios(config.api.lavaAnime + '/v1/index/list/year/')).data.data
      this.loading.year = false
    },
    async onYearTagClick(yearName) { // 点选年份标签
      this.loading.type = true // 启用骨架屏和 Spin
      this.memory.selectedTab.year = yearName
      // 如果是刚刚打开界面，则不取消已选 Type Tab 因为默认值在里面
      if (!this.justOpen) this.memory.selectedTab.type = ''; this.justOpen = false
      let typeList = (await axios(config.api.lavaAnime + '/v1/index/list/type/' + yearName)).data.data
      await new Promise(resolve => { setTimeout(() => { resolve() }, 200); }) // 慢一点切换以便展示动画
      this.tabs.types = typeList
      this.loading.type = false
    },
    async onTypeTagClick(typeName) { // 点选分类标签，获取动画
      this.loading.anime = true
      this.animeCardsClass = 'hidden'
      this.memory.selectedTab.type = typeName
      this.changeUrlParams(this.memory.selectedTab)
      let animeList = (await axios({
        method: 'POST',
        url: config.api.lavaAnime + '/v1/index/list/anime',
        data: {
          year: this.memory.selectedTab.year,
          type: this.memory.selectedTab.type
        }
      })).data.data
      this.animes = animeList // 更新列表
      await new Promise(resolve => { setTimeout(() => { resolve() }, 200); }) // 慢一点切换以便展示动画
      this.animeCardsClass = ''
      this.loading.anime = false
    },
    useUrlParams() { // 从 URL 或全局内存中读取已选索引
      let seletion = this.$route.params.selection.split('-')
      if (seletion.length == 2) {
        this.memory.selectedTab.year = seletion[0]
        this.memory.selectedTab.type = seletion[1]
      }
    },
    changeUrlParams(selectedTab) {
      this.$router.push({ name: 'Index', params: { selection: selectedTab.year + '-' + selectedTab.type }, replace: true })
    }
  },
  async mounted() {
    this.useUrlParams()
    await this.getYear()
    await this.onYearTagClick(this.memory.selectedTab.year)
    await this.onTypeTagClick(this.memory.selectedTab.type)
  }
}
</script>

<template>
  <Container>
    <!-- 选项部分，在高宽度屏幕上将左右 Flex -->
    <div class="lg:basis-1/4 lg:mr-4 select-none">
      <div class="text-lg mb-4 mx-0.5 font-medium">番剧索引</div>
      <!-- 年份部分 -->
      <n-spin :show="loading.year" class="mb-2">
        <!-- 年份骨架屏 -->
        <div class="leading-none" v-if="loading.year">
          <div class="inline-block w-[60px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 17"></div>
        </div>
        <!-- 年份内容 -->
        <n-tag v-if="!loading.year" v-for="yearName in tabs.years" @click="onYearTagClick(yearName)"
          :checked="memory.selectedTab.year == yearName" style="margin: 2px;" checkable>
          {{ yearName }}
        </n-tag>
      </n-spin>

      <!-- 分类部分 -->
      <n-spin :show="loading.type">
        <!-- 分类骨架屏 -->
        <div class="leading-none" v-if="loading.type">
          <div class="inline-block w-[50px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 4"></div>
        </div>
        <!-- 分类内容 -->
        <n-tag v-if="!loading.type" v-for="typeName in tabs.types" @click="onTypeTagClick(typeName)"
          :checked="memory.selectedTab.type == typeName" style="margin: 2px;" checkable>
          {{ typeName }}
        </n-tag>
      </n-spin>
      <n-divider class="lg:hidden" />
    </div>



    <!-- 番剧栅格部分 -->
    <div class="px-1 lg:basis-3/4 lg:ml-4 select-none">
      <n-spin :show="loading.anime">
        <div class="grid 
        grid-cols-3 gap-x-2
        sm:grid-cols-4 sm:gap-x-4
        md:grid-cols-5 md:gap-x-6
        lg:grid-cols-5
        xl:grid-cols-6
        2xl:grid-cols-7">
          <!-- 番剧卡片骨架屏 -->
          <div v-for="a in 16" v-if="loading.anime" class="mb-1">
            <AnimeCard fake></AnimeCard>
          </div>
          <!-- 番剧卡片 -->
          <div v-for="anime in animes" class="mb-1" :class="animeCardsClass">
            <AnimeCard :id="anime.id" :poster="anime.poster" :title="anime.title" :bgmid="anime.bgmid"
              :views="anime.views" />
          </div>
        </div>
      </n-spin>
    </div>
  </Container>
</template>


<style>
</style>