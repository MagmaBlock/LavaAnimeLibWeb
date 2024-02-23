<script setup>
import { useStorage } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const searchValue = ref("");
const searchTimes = ref(0);
const searchResults = ref([]);
const searchHistory = useStorage("searchHistory", []);
const searchRecommendation = ref([]);
const hideFunctions = ref(false);

const search = async (value) => {
  // 校验
  value = value.trim();
  searchValue.value = value;
  if (!value) return;

  try {
    searchResults.value = null; // 进入加载状态
    addSearchHistory(value); // 把搜索词加入记录
    changeUrlParams(value); // 修改 url 参数
    let results = (
      await LavaAnimeAPI.get("/v2/search", { params: { value: value } })
    ).data;
    if (results.code !== 200) return;
    setTimeout(() => {
      // 慢一点切换以便展示动画
      searchResults.value = results.data; // 展示结果
      searchTimes.value++;
      sessionStorage.setItem("lastSearch", value);
    }, 100);
    // 将 Focus DOM 移除焦点(用于关闭搜索框的候选词)
    document.activeElement.blur();
    // 如果是手机，隐藏不重要的标签，让用户直接看到搜索结果
    if (window.innerWidth < 640) hideFunctions.value = true;
  } catch (error) {
    console.error("搜索发生错误: ", error);
  }
};

const addSearchHistory = (value) => {
  searchHistory.value.unshift(value);
  searchHistory.value = Array.from(new Set(searchHistory.value));
  searchHistory.value.splice(20);
};
// 尝试使用 URL 参数或者 sessionStorage 还原搜索词
const useUrlParams = () => {
  let lastSearch = sessionStorage.getItem("lastSearch");
  if (route.params.value) {
    // url
    search(route.params.value);
    console.log("使用 URL 参数进行搜索");
  } else if (lastSearch) {
    search(lastSearch);
    console.log("使用上次的搜索词进行搜索");
  }
};
const changeUrlParams = (value) => {
  router.replace({ name: "search-value", params: { value: value } });
  useHead({ title: `搜索 - ${value}` });
};
const getHotAnimes = async () => {
  try {
    let result = await LavaAnimeAPI.get("/v2/search/hot");
    if (result.data.code == 200) {
      searchRecommendation.value = result.data.data;
    }
  } catch (error) {}
};

onMounted(() => {
  useHead({ title: "搜索" });
  useUrlParams();
  getHotAnimes();
});
</script>

<template>
  <ContainerPage>
    <ContainerPageLeftMenuRightContent>
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
          <NCollapseTransition :show="!hideFunctions">
            <!-- 历史记录 -->
            <NSpace class="my-4" v-if="searchHistory.length">
              <!-- 标签 -->
              <NButton
                size="small"
                secondary
                v-for="value in searchHistory"
                @click="search(value)"
              >
                <NEllipsis style="max-width: 200px">
                  {{ value }}
                </NEllipsis>
              </NButton>
              <!-- 清除按钮 -->
              <NTooltip trigger="hover">
                <template #trigger>
                  <NButton
                    size="small"
                    secondary
                    type="primary"
                    @click="searchHistory = []"
                  >
                    <template #icon>
                      <Icon name="fluent:delete-24-regular" />
                    </template>
                  </NButton>
                </template>
                删除历史记录
              </NTooltip>
            </NSpace>
            <!-- 搜索推荐 -->
            <Transition name="fade" class="my-4">
              <div v-if="searchRecommendation.length">
                <NH3>大家在看</NH3>
                <NSpace class="w-full">
                  <NButton
                    size="small"
                    secondary
                    v-for="value in searchRecommendation"
                  >
                    <NuxtLink
                      :to="{ name: 'anime-la', params: { la: value.id } }"
                    >
                      <NEllipsis style="max-width: 200px">
                        {{ value.title }}
                      </NEllipsis>
                    </NuxtLink>
                  </NButton>
                </NSpace>
              </div>
            </Transition>
            <!-- 其他功能 -->
            <div class="my-4">
              <NH3>其他功能</NH3>
              <NuxtLink to="/search-bgm">
                <NButton size="small" secondary>
                  <NEllipsis style="max-width: 200px">
                    使用 Bangumi ID 搜索
                  </NEllipsis>
                </NButton>
              </NuxtLink>
            </div>
          </NCollapseTransition>
          <NSpace justify="space-around" class="mt-4" v-if="hideFunctions">
            <NButton size="small" tertiary @click="hideFunctions = false">
              <template #icon>
                <Icon name="fluent:arrow-down-24-regular" />
              </template>
              展开
            </NButton>
          </NSpace>
        </div>
      </template>
      <!-- 内容部分 -->
      <template #right>
        <ContainerAnimeCard
          :animes="searchResults"
          size="large"
          v-if="searchTimes"
        />
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>
