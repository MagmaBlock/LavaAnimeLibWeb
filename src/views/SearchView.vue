<script>
import { LavaAnimeAPI } from "../common/api.js";
import Container from "../components/Layout/PageContainer/Container.vue";
import AnimeCardContainer from "../components/Layout/CardContainer/AnimeCardContainer.vue";
import SearchBar from "../components/Search/SearchBar.vue";

import { useStorage } from "@vueuse/core";
import LeftMenuRightContent from "../components/Layout/PageLayout/LeftMenuRightContent.vue";

import { ArrowDownwardRound } from "@vicons/material";
export default {
  data() {
    return {
      searchValue: "",
      searchTimes: 0,
      searchResults: [],
      searchHistory: useStorage("searchHistory", []),
      searchRecommendation: [],
      hideFunctions: false,
    };
  },
  methods: {
    async search(value) {
      // 校验
      value = value.trim();
      this.searchValue = value;
      if (!value) return;

      try {
        this.searchResults = null; // 进入加载状态
        this.addSearchHistory(value); // 把搜索词加入记录
        this.changeUrlParams(value); // 修改 url 参数
        let results = (
          await LavaAnimeAPI.get("/v2/search", { params: { value: value } })
        ).data;
        if (results.code !== 200) return;
        setTimeout(() => {
          // 慢一点切换以便展示动画
          this.searchResults = results.data; // 展示结果
          this.searchTimes++;
          sessionStorage.setItem("lastSearch", value);
        }, 100);
        // 将 Focus DOM 移除焦点(用于关闭搜索框的候选词)
        document.activeElement.blur();
        // 如果是手机，隐藏不重要的标签，让用户直接看到搜索结果
        if (window.innerWidth < 640) this.hideFunctions = true;
      } catch (error) {
        console.error("搜索发生错误: ", error);
      }
    },
    addSearchHistory(value) {
      this.searchHistory.unshift(value);
      this.searchHistory = Array.from(new Set(this.searchHistory));
    },
    // 尝试使用 URL 参数或者 sessionStorage 还原搜索词
    useUrlParams() {
      let lastSearch = sessionStorage.getItem("lastSearch");
      if (this.$route.params.value) {
        // url
        this.search(this.$route.params.value);
        console.log("使用 URL 参数进行搜索");
      } else if (lastSearch) {
        this.search(lastSearch);
        console.log("使用上次的搜索词进行搜索");
      }
    },
    changeUrlParams(value) {
      this.$router.replace({ name: "Search", params: { value: value } });
      document.title = `搜索 - ${value} | 熔岩番剧库 LavaAnimeLib`;
    },
    async getHotAnimes() {
      try {
        let result = await LavaAnimeAPI.get("/v2/search/hot");
        if (result.data.code == 200) {
          this.searchRecommendation = result.data.data;
        }
      } catch (error) {}
    },
  },
  computed: {
    normalTagClass() {
      return [
        "bg-gray-100",
        "hover:bg-gray-200",
        "active:bg-gray-300",
        "dark:bg-zinc-800",
        "dark:hover:bg-zinc-700",
        "dark:active:bg-gray-500",
        "ease-in",
        "duration-200",
        "cursor-pointer",
        "mr-2",
        "mb-2",
        "px-2",
        "py-[3px]",
        "rounded",
        "max-w-xs",
        "overflow-hidden",
        "w-fit",
        "grid",
        "place-items-center",
      ];
    },
    clearTagClass() {
      return `bg-blue-50 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/75 text-blue-500
      ease-in duration-200 cursor-pointer mr-2 mb-2 px-2 grid place-items-center rounded max-w-xs text-ellipsis overflow-hidden`;
    },
  },
  mounted() {
    document.title = "搜索 | 熔岩番剧库 LavaAnimeLib";
    this.useUrlParams();
    this.getHotAnimes();
  },
  components: {
    Container,
    SearchBar,
    AnimeCardContainer,
    LeftMenuRightContent,
    ArrowDownwardRound,
  },
};
</script>

<template>
  <Container>
    <LeftMenuRightContent>
      <!-- 搜索本体部分-->
      <template #left>
        <div>
          <div class="text-lg mb-4 mx-0.5 font-medium">搜索</div>
          <!-- 搜索框 -->
          <SearchBar
            v-model:search="searchValue"
            @search="(value) => search(value)"
          />
          <!-- 搜索框之外的推荐等功能按钮，手机端会在搜索后自动隐藏 -->
          <n-collapse-transition :show="!hideFunctions">
            <!-- 历史记录 -->
            <div
              class="mt-4 w-full flex flex-wrap"
              v-if="this.searchHistory.length"
            >
              <!-- 标签 -->
              <span
                v-for="value in searchHistory"
                @click="search(value)"
                :class="normalTagClass"
              >
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
                  <span
                    v-for="value in searchRecommendation"
                    :class="normalTagClass"
                  >
                    <RouterLink
                      :to="{ name: 'Anime', params: { la: value.id } }"
                    >
                      {{ value.title }}
                    </RouterLink>
                  </span>
                </div>
              </div>
            </Transition>
            <!-- 其他功能 -->
            <div>
              <div class="text-lg my-4 mx-0.5 font-medium">其他功能</div>
              <RouterLink :class="normalTagClass" :to="{ name: 'SearchByBgm' }">
                使用 Bangumi ID 搜索
              </RouterLink>
            </div>
          </n-collapse-transition>
          <n-space justify="space-around" class="mt-4" v-if="hideFunctions">
            <n-button size="small" tertiary @click="hideFunctions = false">
              <template #icon><ArrowDownwardRound /></template>
              展开
            </n-button>
          </n-space>
        </div>
      </template>
      <!-- 内容部分 -->
      <template #right>
        <AnimeCardContainer
          :animes="searchResults"
          size="large"
          v-if="searchTimes"
        />
      </template>
    </LeftMenuRightContent>
  </Container>
</template>
