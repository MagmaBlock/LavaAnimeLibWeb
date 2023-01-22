<script>
import {LavaAnimeAPI} from '@/common/api';
import Container from '../components/Container.vue';
import AnimeCardContainer from '../components/Container/AnimeCardContainer.vue';
import SearchBar from '../components/Search/SearchBar.vue';

import {useStorage} from '@vueuse/core'

export default {
  setup() {
    const searchHistory = useStorage('searchHistory', [])
    return {searchHistory}
  },
  data() {
    return {
      searchValue: '',
      searchTimes: 0,
      searchResults: [],
      searchRecommendation: [],
    };
  },
  methods: {
    async search(value) {
      // 校验
      value = value.trim();
      this.searchValue = value
      if (!value) return;

      try {
        this.searchResults = null; // 进入加载状态
        this.addSearchHistory(value); // 把搜索词加入记录
        this.changeUrlParams(value); // 修改 url 参数
        let results = (await LavaAnimeAPI.get("/v2/search", {params: {value: value}})).data;
        if (results.code !== 200) return;
        setTimeout(() => { // 慢一点切换以便展示动画
          this.searchResults = results.data; // 展示结果
          this.searchTimes++
          sessionStorage.setItem('lastSearch', value)
        }, 100);
      } catch (error) {
        console.error('搜索发生错误: ', error);
      }
    },
    addSearchHistory(value) {
      this.searchHistory.unshift(value)
      this.searchHistory = Array.from(new Set(this.searchHistory))
    },
    // 尝试使用 URL 参数或者 sessionStorage 还原搜索词
    useUrlParams() {
      let lastSearch = sessionStorage.getItem('lastSearch')
      if (this.$route.params.value) { // url  
        this.search(this.$route.params.value)
        console.log('使用 URL 参数进行搜索');
      } else if (lastSearch) {
        this.search(lastSearch)
        console.log('使用上次的搜索词进行搜索');
      }
    },
    changeUrlParams(value) {
      this.$router.replace({name: "Search", params: {value: value}});
      document.title = `搜索 - ${value} | 熔岩番剧库 LavaAnimeLib`
    },
    async getHotAnimes() {
      try {
        let result = await LavaAnimeAPI.get('/v2/search/hot')
        if (result.data.code == 200) {
          this.searchRecommendation = result.data.data
        }
      } catch (error) {
      }
    }
  },
  computed: {
    normalTagClass() {
      return ['bg-gray-100', 'hover:bg-gray-200', 'active:bg-gray-300',
        'dark:bg-zinc-800', 'dark:hover:bg-zinc-700', 'dark:active:bg-gray-500',
        'ease-in', 'duration-200', 'cursor-pointer',
        'mr-2', 'mb-2', 'px-2', 'py-[3px]', 'rounded', 'max-w-xs', 'overflow-hidden', 'grid', 'place-items-center']
    },
    clearTagClass() {
      return `bg-blue-50 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/75 text-blue-500
      ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 grid place-items-center rounded max-w-xs text-ellipsis overflow-hidden`
    }
  },
  mounted() {
    document.title = '搜索 | 熔岩番剧库 LavaAnimeLib'
    this.useUrlParams();
    this.getHotAnimes()
  },
  components: {Container, SearchBar, AnimeCardContainer}
}
</script>

<template>
  <Container>
    <div class="lg:grid lg:grid-cols-4 gap-4">
      <!-- 搜索本体部分，将粘连屏幕 -->
      <!-- 由于 Grid 布局默认将所有子元素拉伸至总高，因此我们在这里使用 self-start 来让元素向上对齐 -->
      <div class="lg:col-span-1 lg:sticky lg:top-8 lg:self-start mb-4 select-none">
        <div class="text-lg mb-4 mx-0.5 font-medium">搜索</div>
        <!-- 搜索框 -->
        <SearchBar v-model:search="searchValue" @search="value => search(value)"/>
        <!-- 历史记录 -->
        <div v-if="this.searchHistory.length" class="mt-4 w-full flex flex-wrap">
          <!-- 标签 -->
          <span v-for="value in searchHistory" :class="normalTagClass" @click="search(value)">
            {{ value }}
          </span>
          <!-- 清除按钮 -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <span :class="clearTagClass" @click="searchHistory = []">
                <i class="bi bi-x-lg"></i>
              </span>
            </template>
            删除历史记录
          </n-tooltip>
        </div>
        <!-- 搜索推荐 -->
        <Transition name="fade">
          <div v-if="searchRecommendation.length">
            <div class="text-lg mt-4 mx-0.5 font-medium">大家在看</div>
            <div class="mt-4 w-full flex flex-wrap">
              <span v-for="value in searchRecommendation" :class="normalTagClass">
                <RouterLink :to="{ name: 'Anime', params: { la: value.id } }">
                  {{ value.title }}
                </RouterLink>
              </span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 内容部分 -->
      <AnimeCardContainer v-if="searchTimes" :animes="searchResults" class="lg:col-span-3" size="large"/>
    </div>
  </Container>
</template>