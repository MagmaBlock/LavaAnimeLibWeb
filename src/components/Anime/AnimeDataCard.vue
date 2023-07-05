<script setup>
import { useClipboard } from "@vueuse/core";
import { useAnimeStore } from "../../store/Anime";
import AnimeBasicCard from "./Cards/AnimeBasicCard.vue";
import { computed, ref } from "vue";

const store = useAnimeStore();

const showMore = ref(false);

// 运营工具
const showTools = ref(false);
const { copy } = useClipboard();
const getPath = computed(() => {
  return `D:\\OneDrive - MSFT\\LavaAnimeLib\\${store.animeData?.index.year}\\${store.animeData?.index.type}\\${store.animeData?.index.name}`;
});
const getRuleName = computed(() => {
  let month = store.animeData?.index.type.match(/^\d{1,2}/);
  if (!month) {
    month = "other";
  }
  return `【${month}】${store.animeData?.index.name}`;
});
const getWebsite = computed(() => {
  if (!store.animeData?.infobox) return;
  let result = store.animeData?.infobox?.find((kv) => {
    return ["官方网站", "官网", "网站"].includes(kv.key);
  });
  if (result?.value) {
    return [
      result.value,
      result.value + (result.value.endsWith("/") ? "story" : "/story"),
      result.value + (result.value.endsWith("/") ? "episodes" : "/episodes"),
    ];
  } else return;
});
</script>

<template>
  <AnimeBasicCard class="select-text">
    <!-- 面包屑导航 但是不能点 -->
    <div class="px-4 py-2 text-sm text-gray-500 border-b dark:border-zinc-700">
      <RouterLink :to="{ name: 'Index' }">
        {{ store.animeData?.index.year }}
        <i class="bi bi-chevron-right text-xs"></i>
        {{ store.animeData?.index.type }}
        <i class="bi bi-chevron-right text-xs"></i>
      </RouterLink>
      <!-- (临时) 小工具 -->
      <span class="ml-1 cursor-help" @click="() => (showTools = true)">
        {{ store.animeData?.index.name }}
      </span>
      <NDrawer
        v-model:show="showTools"
        placement="bottom"
        :default-height="540"
        resizable
      >
        <NDrawerContent title="番剧库运营工具">
          <n-list bordered>
            <n-list-item>
              <n-thing title="RuleName" :description="getRuleName"> </n-thing>
              <template #suffix>
                <NButton @click="copy(getRuleName)"> 复制 </NButton>
              </template>
            </n-list-item>
            <n-list-item>
              <n-thing title="Path" :description="getPath"> </n-thing>
              <template #suffix>
                <NButton @click="copy(getPath)"> 复制 </NButton>
              </template>
            </n-list-item>
            <n-list-item v-if="store.animeData?.name">
              <n-thing title="Name" :description="store.animeData.name">
              </n-thing>
              <template #suffix>
                <NButton @click="copy(store.animeData.name)"> 复制 </NButton>
              </template>
            </n-list-item>
            <n-list-item v-if="store.animeData?.name_cn">
              <n-thing title="NameCN" :description="store.animeData.name_cn">
              </n-thing>
              <template #suffix>
                <NButton @click="copy(store.animeData.name_cn)"> 复制 </NButton>
              </template>
            </n-list-item>
            <n-list-item v-if="getWebsite">
              <n-thing title="Website"> </n-thing>
              <template v-for="url in getWebsite">
                <NA target="_blank" :href="url">
                  {{ url }}
                </NA>
                <br />
              </template>
            </n-list-item>
          </n-list>
        </NDrawerContent>
      </NDrawer>
    </div>
    <!-- 主信息卡 -->
    <div class="py-3 px-4">
      <!-- 标题块 -->
      <div class="mb-1">
        <div class="text-xl inline-block mr-2">
          {{ store.animeData?.title }}
          <span class="text-base"
            >({{ store.animeData?.index.year.replace("年", "") }})</span
          >
        </div>
        <div
          class="text-sm leading-5 text-gray-500 inline-block"
          v-if="store.animeData?.bgmID"
        >
          {{ store.animeData?.name }} · {{ store.animeData?.platform }}
        </div>
      </div>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2"
            ><i class="bi bi-play-btn"></i> 播放
            {{ store.animeData?.views }} 次</span
          >
          <div class="mr-2 my-1" v-if="!store.animeData?.bgmID">
            本作是 Bangumi 未收录番剧，或者可能根本不是一个影视作品
          </div>
          <span class="mr-2" v-if="store.animeData?.bgmID"
            ><i class="bi bi-star"></i> {{ store.animeData?.rating.score }} 分
            <span
              v-if="store.animeData?.rating.rank"
              class="bg-gray-100 text-black dark:bg-zinc-700 dark:text-zinc-200 rounded-sm px-1.5 text-xs align-baseline"
            >
              Rank.#{{ store.animeData?.rating.rank }}
            </span>
          </span>
        </div>
        <!-- 第二行 -->
        <div v-if="store.animeData?.bgmID" class="inline-block">
          <span class="mr-2"
            ><i class="bi bi-calendar-event"></i>
            {{ store.animeData?.date || "未来" }} 开始放送</span
          >
          <span class="mr-2"
            ><i class="bi bi-collection"></i>
            {{ store.animeData?.eps }} 话</span
          >
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 flex flex-wrap" v-if="store.animeData?.bgmID">
        <TransitionGroup
          enter-active-class="animate__animated animate__zoomIn animate__faster"
          leave-active-class="animate__animated animate__zoomOut animate__faster"
        >
          <template v-for="(tag, index) in store.animeData?.tags" :key="index">
            <n-tag
              size="small"
              class="mr-1 mb-1 flex-initial max-w-xs overflow-hidden"
              :bordered="false"
              v-show="index <= store.animeData?.tags.length / 3 || showMore"
            >
              {{ tag.name }} {{ tag.count }}
            </n-tag>
          </template>
        </TransitionGroup>
        <span>
          <n-tag
            size="small"
            class="mr-1 mb-1 text-gray-300 dark:text-zinc-200"
            :bordered="false"
            @click="showMore = !showMore"
            checkable
          >
            {{ showMore ? "收起" : "展开" }}
          </n-tag>
        </span>
      </div>
      <!-- 连接 -->
      <div class="px-0.5 text-sm text-blue-600">
        <a
          :href="'https://bgm.tv/subject/' + store.animeData?.bgmID"
          target="_blank"
        >
          <i class="bi bi-box-arrow-up-right"></i> 在番组计划中打开
        </a>
      </div>
    </div>
  </AnimeBasicCard>
</template>
