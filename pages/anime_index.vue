<script>
export default {
  data() {
    return {
      searchValue: "",
      selectedTab: {
        year: "2023年",
        type: "10月秋",
      },
      tabs: { year: [], type: [] },
      animes: null,
      loading: {
        year: true,
        type: true,
      },
      justOpen: true,
    };
  },
  methods: {
    async getIndex() {
      let index = (await LavaAnimeAPI("/v2/index/info")).data;
      if (index.code == 200) index = index.data;
      else throw new Error("索引获取失败");
      this.tabs = index;
      this.loading.year = false; // 动画
      this.loading.type = false;
    },
    async onTagClick(tagName, type) {
      if (this.selectedTab[type] == tagName) {
        // 点击的标签已经被选择
        if (this.isGoingEmpty()) return; // 当筛选条件已剩最后一个，禁止继续取消
        else this.selectedTab[type] = ""; // 取消当前筛选条件
      } else {
        // 点击的标签未被选择
        this.selectedTab[type] = tagName; // 将其选择
      }
      await this.queryIndex();
    },
    async queryIndex() {
      this.animes = null; // 移除数据，进入空状态
      let animeList = (
        await LavaAnimeAPI.post("/v2/index/query", this.selectedTab)
      ).data.data;
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      }); // 慢一点切换以便展示动画
      this.animes = animeList; // 更新列表，同时解除空状态
    },
    // 判断是否仅剩一个选择项
    isGoingEmpty() {
      let trueKeys = 0; // 仍然激活的条件类型
      Object.keys(this.selectedTab).forEach((keyName) => {
        // 遍历每个可选项
        if (this.selectedTab[keyName]) trueKeys++;
      });
      return trueKeys <= 1;
    },
    // 从 sessionStorage 读取上次访问
    getSessionCache() {
      let cache = JSON.parse(sessionStorage.getItem("IndexSelectedTab"));
      if (cache) this.selectedTab = cache;
    },
  },
  watch: {
    selectedTab: {
      handler() {
        sessionStorage.setItem(
          "IndexSelectedTab",
          JSON.stringify(this.selectedTab)
        );
      },
      deep: true,
    },
  },
  async mounted() {
    document.title = "索引 | 熔岩番剧库 LavaAnimeLib";
    this.getSessionCache();
    this.getIndex();
    this.queryIndex();
  },
};
</script>

<template>
  <ContainerPage>
    <ContainerPageLeftMenuRightContent>
      <!-- 选项本体部分，将粘连屏幕 -->
      <template #left>
        <div>
          <!-- 快速搜索框 -->
          <SearchBar
            v-model:search="searchValue"
            @search="(value) => $router.push('/search/' + value)"
          />
          <!-- 标题 -->
          <NH3 class="my-4">番剧索引</NH3>
          <NH4 class="hidden lg:inline">按年份</NH4>
          <!-- 年份部分 -->
          <NSpin :show="loading.year" class="my-4">
            <NSpace :size="8">
              <!-- 年份骨架屏 -->
              <template v-if="loading.year">
                <div
                  class="inline-block w-16 h-7 bg-gray-300 dark:bg-zinc-800 animate-pulse"
                  v-for="a in 19"
                ></div>
              </template>
              <!-- 年份内容 -->
              <template v-if="!loading.year" v-for="yearName in tabs.year">
                <IndexSelectButton
                  :active="selectedTab.year == yearName"
                  @click="onTagClick(yearName, 'year')"
                >
                  {{ yearName }}
                </IndexSelectButton>
              </template>
            </NSpace>
          </NSpin>
          <NDivider class="hidden lg:block" />
          <!-- 分类部分 -->
          <NH4 class="hidden lg:inline">季度、类型</NH4>
          <NSpin :show="loading.type" class="my-4">
            <NSpace :size="8">
              <!-- 分类骨架屏 -->
              <div class="leading-none" v-if="loading.type">
                <div
                  class="inline-block w-16 h-7 bg-gray-300 dark:bg-zinc-800 animate-pulse"
                  v-for="a in 9"
                ></div>
              </div>
              <!-- 分类内容 -->
              <template v-if="!loading.type" v-for="typeName in tabs.type">
                <IndexSelectButton
                  :active="selectedTab.type == typeName"
                  @click="onTagClick(typeName, 'type')"
                >
                  {{ typeName }}
                </IndexSelectButton>
              </template>
            </NSpace>
          </NSpin>
        </div>
      </template>
      <!-- 番剧栅格部分 -->
      <template #right>
        <ContainerAnimeCard :animes="this.animes" size="large" />
      </template>
      <!-- 扩展页尾 -->
      <template #foot>
        <IndexActivityCard />
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>
