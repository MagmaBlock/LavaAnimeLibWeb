<script>
import { LavaAnimeAPI } from '../common/api';
import Container from '../components/Container.vue';
import AnimeCardContainer from '../components/Container/AnimeCardContainer.vue';
import SearchBar from '../components/Search/SearchBar.vue';

export default {
  props: ["memory"],
  data() {
    return {
      searchTimes: 0,
      searchResults: [],
      searchHistory: [],
      lastSearch: "",
      searchRecommendation: ["电锯人", "间谍过家家", "灵能百分百", "转生成为魔剑", "孤独摇滚", "想要成为影之实力者", "Do It Yourself", "向山进发", "入间同学"],
    };
  },
  methods: {
    async search(value) {
      // 校验
      value = value.trim();
      if (!value || this.lastSearch == value) return;

      try {
        this.memory.searchValue = value;
        this.searchResults = null; // 进入加载状态
        this.addSearchHistory(value); // 把搜索词加入记录
        this.changeUrlParams(value); // 修改 url 参数
        let results = (await LavaAnimeAPI.get("/v2/search", { params: { value: this.memory.searchValue } })).data;
        if (results.code !== 200) return;
        setTimeout(() => { // 慢一点切换以便展示动画
          this.searchResults = results.data; // 展示结果
          this.searchTimes++
          this.lastSearch = value;
        }, 100);
      } catch (error) {
        console.error('搜索发生错误: ', error);
      }
    },

    loadSearchHistory() {
      let localStorageHistory = JSON.parse(localStorage.getItem("searchHistory"));
      if (typeof localStorageHistory == "object" && localStorageHistory) {
        console.log("searchHistory from localStorage: ", localStorageHistory);
        this.searchHistory = localStorageHistory;
      }
    },
    addSearchHistory(value) {
      let newList = [value];
      for (let i in this.searchHistory) {
        if (this.searchHistory[i] != value && i <= 10) {
          newList.push(this.searchHistory[i]);
        }
      }
      this.searchHistory = newList;
    },
    clearSearchHistroy() {
      this.searchHistory = [];
    },

    useUrlParams() {
      let searchValue = this.$route.params.value ? this.$route.params.value : this.memory.searchValue;
      this.search(searchValue);
    },
    changeUrlParams(value) {
      this.$router.replace({ name: "Search", params: { value: value } });
      document.title = `搜索 - ${value} | 熔岩番剧库 LavaAnimeLib`
    }
  },
  computed: {
    normalTagClass() {
      return ['bg-gray-100', 'hover:bg-gray-200', 'active:bg-gray-300',
        'dark:bg-zinc-800', 'dark:hover:bg-zinc-700', 'dark:active:bg-gray-500',
        'ease-in', 'duration-200', 'cursor-pointer',
        'mr-2', 'mb-2', 'px-2', 'rounded', 'max-w-xs', 'overflow-hidden']
    }
  },
  mounted() {
    document.title = '搜索 | 熔岩番剧库 LavaAnimeLib'
    this.loadSearchHistory();
    this.useUrlParams();
  },
  watch: {
    searchHistory() {
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory)); // JSON 存储至 localHistory
    }
  },
  components: { Container, SearchBar, AnimeCardContainer }
}
</script>

<template>
  <Container>
    <div class="lg:flex">
      <!-- 搜索框容器部分，在高宽度屏幕上将左右 Flex -->
      <div class="lg:basis-1/4 flex-none">
        <!-- 搜索本体部分，将粘连屏幕 -->
        <div class="sticky top-5 select-none">
          <div class="text-lg mb-4 mx-0.5 font-medium">搜索</div>
          <!-- 搜索框 -->
          <SearchBar :search="memory.searchValue" />
          <!-- 历史记录 -->
          <div class="my-4 w-full flex flex-wrap">
            <!-- 标签 -->
            <span v-for="value in searchHistory" @click="search(value)" :class="normalTagClass">
              <div class="leading-loose text-ellipsis overflow-hidden">
                {{ value }}
              </div>
            </span>
            <!-- 清除按钮 -->
            <span class="bg-blue-50 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/75
              ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 rounded max-w-xs overflow-hidden"
              @click="clearSearchHistroy()" v-if="this.searchHistory.length > 0">
              <div class="leading-loose truncate text-blue-500">
                <i class="bi bi-x-lg"></i>
              </div>
            </span>
          </div>
          <!-- 搜索推荐 -->
          <div class="text-lg mb-4 mx-0.5 font-medium">大家在搜</div>
          <div class="my-4 w-full flex flex-wrap">
            <span v-for="value in searchRecommendation" @click="search(value)" :class="normalTagClass">
              <div class="leading-loose text-ellipsis overflow-hidden">
                {{ value }}
              </div>
            </span>
          </div>
        </div>
      </div>

      <!-- 内容部分 -->
      <AnimeCardContainer :animes="searchResults" size="large" class="lg:basis-3/4 flex-none px-2 lg:px-4 "
        v-if="searchTimes" />
    </div>
  </Container>
</template>