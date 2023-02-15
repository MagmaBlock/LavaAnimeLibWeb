<script>
import { LavaAnimeAPI } from '../common/api.js'
import Container from '../components/Layout/PageContainer/Container.vue';
import AnimeCardContainer from '../components/Layout/CardContainer/AnimeCardContainer.vue';
import SearchBar from '../components/Search/SearchBar.vue';
import LeftMenuRightContent from '../components/Layout/PageLayout/LeftMenuRightContent.vue';

export default {
  data() {
    return {
      searchValue: '',
      selectedTab: {
        year: "2023年",
        type: "1月冬"
      },
      tabs: { year: [], type: [] },
      animes: null,
      loading: {
        year: true,
        type: true,
      },
      justOpen: true
    };
  },
  methods: {
    async getIndex() {
      let index = (await LavaAnimeAPI("/v2/index/info")).data;
      if (index.code == 200)
        index = index.data;
      else
        throw new Error("索引获取失败");
      this.tabs = index;
      this.loading.year = false; // 动画
      this.loading.type = false;
    },
    async onTagClick(tagName, type) {
      if (this.selectedTab[type] == tagName) { // 点击的标签已经被选择
        if (this.isGoingEmpty())
          return; // 当筛选条件已剩最后一个，禁止继续取消
        else
          this.selectedTab[type] = ""; // 取消当前筛选条件
      }
      else { // 点击的标签未被选择
        this.selectedTab[type] = tagName; // 将其选择
      }
      await this.queryIndex();
    },
    async queryIndex() {
      this.animes = null; // 移除数据，进入空状态
      let animeList = (await LavaAnimeAPI.post("/v2/index/query", this.selectedTab)).data.data;
      await new Promise(resolve => { setTimeout(() => { resolve(); }, 200); }); // 慢一点切换以便展示动画
      this.animes = animeList; // 更新列表，同时解除空状态
    },
    // 判断是否仅剩一个选择项
    isGoingEmpty() {
      let trueKeys = 0; // 仍然激活的条件类型
      Object.keys(this.selectedTab).forEach(keyName => { // 遍历每个可选项
        if (this.selectedTab[keyName]) trueKeys++
      })
      return trueKeys <= 1
    },
    // 从 sessionStorage 读取上次访问
    getSessionCache() {
      let cache = JSON.parse(sessionStorage.getItem('IndexSelectedTab'))
      if (cache) this.selectedTab = cache
    }
  },
  watch: {
    selectedTab: {
      handler() {
        sessionStorage.setItem('IndexSelectedTab', JSON.stringify(this.selectedTab))
      },
      deep: true
    }
  },
  async mounted() {
    document.title = '索引 | 熔岩番剧库 LavaAnimeLib'
    this.getSessionCache()
    this.getIndex()
    this.queryIndex()
  },
  components: { Container, SearchBar, AnimeCardContainer, LeftMenuRightContent }
}
</script>

<template>
  <Container>
    <LeftMenuRightContent>
      <!-- 选项本体部分，将粘连屏幕 -->
      <template #left>
        <div>
          <!-- 快速搜索框 -->
          <SearchBar v-model:search="searchValue" @search="value => $router.push('/search/' + value)" />
          <!-- 标题 -->
          <div class="text-lg my-4 mx-0.5 font-medium">番剧索引</div>
          <!-- 年份部分 -->
          <n-spin :show="loading.year" class="mb-2">
            <div class="flex flex-wrap">
              <!-- 年份骨架屏 -->
              <template v-if="loading.year">
                <div class="inline-block w-[60px] h-7 m-0.5 bg-gray-300 dark:bg-zinc-800 animate-pulse" v-for="a in 19">
                </div>
              </template>
              <!-- 年份内容 -->
              <template v-if="!loading.year" v-for="yearName in tabs.year">
                <div class="rounded cursor-pointer ease-in duration-100 px-2 py-1 m-0.5"
                  @click="onTagClick(yearName, 'year')"
                  :class="selectedTab.year == yearName ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-gray-500 dark:text-zinc-200'">
                  {{ yearName }}
                </div>
              </template>
            </div>
          </n-spin>
          <div class="h-[0.5px] bg-gray-200 dark:bg-gray-700 my-6 hidden lg:block"></div>
          <!-- 分类部分 -->
          <n-spin :show="loading.type">
            <div class="flex flex-wrap">
              <!-- 分类骨架屏 -->
              <div class="leading-none" v-if="loading.type">
                <div class="inline-block w-[50px] h-7 bg-gray-300 dark:bg-zinc-800 m-0.5 animate-pulse" v-for="a in 8">
                </div>
              </div>
              <!-- 分类内容 -->
              <template v-if="!loading.type" v-for="typeName in tabs.type">
                <div class="rounded cursor-pointer ease-in duration-100 px-2 py-1 m-0.5"
                  @click="onTagClick(typeName, 'type')"
                  :class="selectedTab.type == typeName ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-gray-500 dark:text-zinc-200'">
                  {{ typeName }}
                </div>
              </template>
            </div>
          </n-spin>
          <div class="h-[0.5px] bg-gray-200 dark:bg-gray-700 my-6 lg:hidden"></div>
        </div>
      </template>
      <!-- 番剧栅格部分 -->
      <template #right>
        <AnimeCardContainer :animes="this.animes" size="large" />
      </template>
    </LeftMenuRightContent>
  </Container>
</template>