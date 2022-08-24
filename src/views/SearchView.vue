<script>
import { LavaAnimeAPI } from '../common/api';
import config from '../common/config';
import FullScreenAnimeCardContainer from '../components/Container/FullScreenAnimeCardContainer.vue';

export default {
  props: ["memory"],
  data() {
    return {
      searchTimes: 0,
      searchResults: [],
      searchHistory: [],
      lastSearch: "",
      searchRecommendation: ["Lycoris Recoil", "异世界舅舅", "OVERLORD", "Engage Kiss", "来自深渊", "夏日重现", "实力至上主义教室", "间谍过家家"],
      preSearchValues: [],
      preSearchLock: false,
      loading: {
        search: false
      }
    };
  },
  methods: {
    async search(value) {
      if (!value.trim() || this.lastSearch == value)
        return;
      this.memory.searchValue = value;
      this.loading.search = true; // 启动加载动画
      this.searchTimes++; // 增加本界面搜索计数
      this.searchResults = []; // 清空已有列表
      this.addSearchHistory(this.memory.searchValue); // 把搜索词加入记录
      this.changeUrlParams(this.memory.searchValue);
      // let type = parseInt(this.memory.searchValue) && this.memory.searchValue.length >= 3 ? 'bgm' : 'name' // 判断搜索类型
      let results = (await LavaAnimeAPI.get("/v2/search", { params: { value: this.memory.searchValue } })).data.data;
      await new Promise(resolve => { setTimeout(() => { resolve(); }, 100); }); // 慢一点切换以便展示动画
      this.lastSearch = value;
      this.loading.search = false; // 关闭加载动画
      this.searchResults = results; // 展示结果
    },
    async preSearch(value) {
      if (!value.trim() || this.preSearchLock)
        return;
      value = value.trim();
      this.preSearchLock = true;
      let results = (await LavaAnimeAPI.get("/v2/search/quick", { params: { value: value } })).data;
      console.log(results);
      setTimeout(() => { this.preSearchLock = false; console.log("unlocked", this.preSearchLock); }, 500); // 0.5 秒可触发一次防止网络请求阻塞
      if (results.code == 200)
        this.preSearchValues = results.data;
    },
    clickHistoryTag(value) {
      this.memory.searchValue = value;
      this.search(value);
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
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory)); // JSON 存储至 localHistory
    },
    clearSearchHistroy() {
      this.searchHistory = [];
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory)); // JSON 存储至 localHistory
    },
    useUrlParams() {
      let searchValue = this.$route.params.value ? this.$route.params.value : this.memory.searchValue;
      this.search(searchValue);
    },
    changeUrlParams(value) {
      this.$router.replace({ name: "Search", params: { value: value } });
    }
  },
  mounted() {
    this.loadSearchHistory();
    this.useUrlParams();
  },
  components: { FullScreenAnimeCardContainer }
}
</script>

<template>
  <Container>
    <div class="lg:flex lg:flex-row">
      <!-- 搜索框部分，在高宽度屏幕上将左右 Flex -->
      <div class="px-1 lg:basis-1/4 select-none">
        <!-- 将粘连屏幕 -->
        <div class="sticky top-5">
          <div class="text-lg mb-4 mx-0.5 font-medium">搜索</div>
          <n-input-group>
            <n-auto-complete placeholder="按 Tab 搜索键入值, Enter 和 ↑ ↓ 使用候选"
              :input-props="{ type: 'text', name: 'search', autocomplete: 'off' }" v-model:value="memory.searchValue"
              :options="preSearchValues" @input="preSearch(memory.searchValue)"
              @keydown.enter="search(this.memory.searchValue)" blur-after-select
              @blur="search(this.memory.searchValue)" />
            <n-button type="primary" @click="search(this.memory.searchValue)" ghost>搜索</n-button>
          </n-input-group>
          <!-- 历史记录 -->
          <div class="my-4 w-full flex flex-wrap">
            <!-- 标签 -->
            <span v-for="value in searchHistory" @click="search(value)"
              class="bg-gray-100 hover:bg-gray-200 ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 rounded-sm flex-initial max-w-xs overflow-hidden">
              <div class="leading-loose truncate">
                {{ value }}
              </div>
            </span>
            <!-- 清除按钮 -->
            <span
              class="bg-blue-50 hover:bg-blue-200 ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 rounded-sm flex-initial max-w-xs overflow-hidden"
              @click="clearSearchHistroy()" v-if="this.searchHistory.length > 0">
              <div class="leading-loose truncate text-blue-500">
                <i class="bi bi-x-lg"></i>
              </div>
            </span>
          </div>
          <!-- 搜索推荐 -->
          <div class="text-lg mb-4 mx-0.5 font-medium">大家在搜</div>
          <div class="my-4 w-full flex flex-wrap">
            <span v-for="value in searchRecommendation" @click="clickHistoryTag(value)"
              class="bg-gray-100 hover:bg-gray-200 ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 rounded-sm flex-initial max-w-xs overflow-hidden">
              <div class="leading-loose truncate">
                {{ value }}
              </div>
            </span>
          </div>
        </div>
      </div>

      <!-- 内容部分 -->
      <FullScreenAnimeCardContainer :animes="searchResults" class="lg:basis-3/4 lg:ml-4" v-if="searchTimes">
      </FullScreenAnimeCardContainer>
    </div>
  </Container>
</template>