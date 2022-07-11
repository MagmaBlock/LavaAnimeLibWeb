<script>
import axios from 'axios';
import config from '../assets/config';

export default {
  props: ['memory'],
  data() {
    return {
      searchTimes: 0,
      searchResults: [],
      searchHistory: [],
      searchRecommendation: ['异世界舅舅', 'OVERLORD', 'Lycoris Recoil', 'Engage Kiss', '来自深渊', '实力至上主义教室', '间谍过家家'],
      loading: {
        search: false
      }
    }
  },
  methods: {
    async search(value) { // 执行搜索
      if (!value.trim()) return;
      this.memory.searchValue = value
      this.loading.search = true // 启动加载动画
      this.searchTimes++ // 增加本界面搜索计数
      this.searchResults = [] // 清空已有列表
      this.addSearchHistory(this.memory.searchValue) // 把搜索词加入记录
      this.changeUrlParams(this.memory.searchValue)
      let type = parseInt(this.memory.searchValue) && this.memory.searchValue.length >= 3 ? 'bgm' : 'name' // 判断搜索类型
      let results = (await (axios(config.api.lavaAnime + `/v1/search/${type}/${this.memory.searchValue}`))).data.data
      await new Promise(resolve => { setTimeout(() => { resolve() }, 100); }) // 慢一点切换以便展示动画
      this.loading.search = false // 关闭加载动画
      this.searchResults = results // 展示结果
    },
    clickHistoryTag(value) {
      this.memory.searchValue = value
      this.search(value)
    },
    loadSearchHistory() { // 从 localHistory 读取历史
      let localStorageHistory = JSON.parse(localStorage.getItem('searchHistory'))
      if (typeof localStorageHistory == 'object' && localStorageHistory) {
        console.log('searchHistory from localStorage: ', localStorageHistory);
        this.searchHistory = localStorageHistory
      }
    },
    addSearchHistory(value) { // 增加一个 History Tag 同时删除历史中所有同名记录 
      let newList = [value]
      for (let i in this.searchHistory) {
        if (this.searchHistory[i] != value && i <= 10) {
          newList.push(this.searchHistory[i])
        }
      }
      this.searchHistory = newList
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory)) // JSON 存储至 localHistory
    },
    clearSearchHistroy() {
      this.searchHistory = []
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory)) // JSON 存储至 localHistory
    },
    useUrlParams() { // 从 URL 或全局内存中读取搜索词
      let searchValue = this.$route.params.value ? this.$route.params.value : this.memory.searchValue
      this.search(searchValue)
    },
    changeUrlParams(value) {
      this.$router.replace({ name: 'Search', params: { value: value } })
    }
  },
  mounted() {
    this.loadSearchHistory();
    this.useUrlParams();
  }
}
</script>

<template>
  <Container>
    <!-- 搜索框部分，在高宽度屏幕上将左右 Flex -->
    <div class="px-1 lg:basis-1/4 lg:mr-4 select-none">
      <div class="text-lg mb-4 mx-0.5 font-medium">搜索</div>
      <n-input-group>
        <n-input v-model:value="memory.searchValue" type="text" placeholder="使用番剧名或 Bangumi ID 进行搜索"
          @keyup.enter="search(this.memory.searchValue)" />
        <n-button type="primary" @click="search(this.memory.searchValue)" ghost>搜索</n-button>
      </n-input-group>
      <!-- 历史记录 -->
      <div class="my-4 w-full">
        <!-- 历史 -->
        <n-button v-for="value in searchHistory" size="small" class="bg-gray-100 mr-2 mb-2"
          @click="clickHistoryTag(value)" secondary>{{ value }}</n-button>
        <!-- 清除按钮 -->
        <n-button type="primary" @click="clearSearchHistroy()" size="small" class="text-xs"
          v-if="this.searchHistory.length > 0" secondary>
          <i class="bi bi-x-lg"></i>
        </n-button>
      </div>
      <!-- 搜索推荐 -->
      <div class="text-lg mb-4 mx-0.5 font-medium">大家在搜</div>
      <div class="my-4 w-full">
        <n-button v-for="value in searchRecommendation" size="small" class="bg-gray-100 mr-2 mb-2"
          @click="clickHistoryTag(value)" secondary>{{ value }}</n-button>
      </div>
    </div>

    <!-- 内容部分 -->
    <div class="lg:basis-3/4 lg:ml-4 select-none">
      <div class="px-1 lg:basis-3/4 lg:ml-4">
        <n-spin :show="loading.search">
          <div class="grid 
        grid-cols-3 gap-x-2
        sm:grid-cols-4 sm:gap-x-4
        md:grid-cols-5 md:gap-x-6
        lg:grid-cols-5
        xl:grid-cols-6
        2xl:grid-cols-7">
            <!-- 番剧卡片骨架屏 -->
            <div v-for="a in 6" v-if="loading.search" class="mb-1">
              <AnimeCard fake></AnimeCard>
            </div>
            <!-- 番剧卡片 -->
            <div v-for="anime in searchResults" class="mb-1">
              <AnimeCard :id="anime.id" :poster="anime.poster" :title="anime.title" :bgmid="anime.bgmid"
                :views="anime.views" />
            </div>
          </div>
          <div v-if="searchResults.length == 0 && searchTimes != 0 && loading.search == false" class="my-14">
            <n-empty description="什么也没找到">
              <template #icon>
                <img src="../assets/huaji.jpg" />
              </template>
            </n-empty>
          </div>
        </n-spin>
      </div>
    </div>
  </Container>
</template>