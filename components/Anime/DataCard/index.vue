<script setup>
const store = useAnimeStore();

// 展示更多
const showMore = ref(false);
// 运营工具
const showTools = ref(false);
</script>

<template>
  <AnimeCardBasic class="select-text">
    <!-- 面包屑导航 但是不能点 -->
    <div class="pb-2 text-sm text-gray-500">
      <NuxtLink :to="{ path: '/anime-index' }">
        {{ store.animeData?.index.year }}
        <span class="text-xs inline-block">
          <Icon name="bi-chevron-right"></Icon>
        </span>
        {{ store.animeData?.index.type }}
        <span class="text-xs inline-block">
          <Icon name="bi-chevron-right"></Icon>
        </span>
      </NuxtLink>
      <!-- 番剧库运营工具 -->
      <span
        class="ml-1 cursor-help"
        @click="() => (store.showAdminTools = true)"
      >
        {{ store.animeData?.index.name }}
      </span>
    </div>
    <!-- 主信息卡 -->
    <div class="pt-2">
      <NSpace justify="space-between" :wrap="false">
        <!-- 标题块 -->
        <NSpace class="mb-1" :align="'end'">
          <div class="text-xl inline-block">
            {{ store.animeData?.title }}
            <span class="text-base">
              ({{ store.animeData?.index.year.replace("年", "") }})
            </span>
          </div>
          <div
            class="text-sm leading-5 text-gray-500 inline-block"
            v-if="store.animeData?.bgmID"
          >
            {{ store.animeData?.name }} · {{ store.animeData?.platform }}
          </div>
          <!-- Tags -->
          <NSpace :size="2">
            <span
              v-if="store.animeData?.type?.bdrip"
              class="rounded px-1.5 text-xs font-medium bg-blue-500 text-white"
            >
              BD
            </span>
            <span
              v-if="store.animeData?.type?.nsfw"
              class="rounded px-1.5 text-xs font-medium bg-yellow-500 text-white"
            >
              NSFW
            </span>
          </NSpace>
        </NSpace>
        <AnimeFollowButton :anime-id="store.laID" />
      </NSpace>
      <!-- 主要信息 -->
      <div class="px-0.5 text-sm leading-5 text-gray-500">
        <!-- 第一行 -->
        <div class="inline-block">
          <span class="mr-2">
            <i class="bi bi-play-btn"></i> 播放
            {{ store.animeData?.views }} 次</span
          >
          <div class="mr-2 my-1" v-if="!store.animeData?.bgmID">
            本作是 Bangumi 未收录番剧，或者可能根本不是一个影视作品
          </div>
          <span class="mr-2" v-if="store.animeData?.bgmID">
            <i class="bi bi-star"></i> {{ store.animeData?.rating.score }} 分
            <span
              v-if="store.animeData?.rating.rank"
              class="bg-gray-100 text-black dark:bg-zinc-700 dark:text-zinc-200 rounded px-1.5 text-xs align-baseline"
            >
              Rank.#{{ store.animeData?.rating.rank }}
            </span>
          </span>
        </div>
        <!-- 第二行 -->
        <div v-if="store.animeData?.bgmID" class="inline-block">
          <span class="mr-2">
            <i class="bi bi-calendar-event"></i>
            {{ store.animeData?.date || "未来" }} 开始放送
          </span>
          <span class="mr-2">
            <i class="bi bi-collection"></i> {{ store.animeData?.eps }} 话
          </span>
        </div>
        <!-- 其他提示 -->
        <div>
          <div v-if="store.animeData?.type?.nsfw">
            此作品被标记为 “NSFW”, 可能含有不适宜在公开场合观看的内容。
          </div>
        </div>
      </div>
      <!-- 标签 -->
      <div class="my-1 flex flex-wrap" v-if="store.animeData?.bgmID">
        <TransitionGroup
          enter-active-class="animate__animated animate__zoomIn animate__faster"
          leave-active-class="animate__animated animate__zoomOut animate__faster"
        >
          <template v-for="(tag, index) in store.animeData?.tags" :key="index">
            <NTag
              size="small"
              class="mr-1 mb-1 flex-initial max-w-xs overflow-hidden"
              :bordered="false"
              v-show="index <= store.animeData?.tags.length / 3 || showMore"
            >
              {{ tag.name }} {{ tag.count }}
            </NTag>
          </template>
        </TransitionGroup>
        <span>
          <NTag
            size="small"
            class="mr-1 mb-1 text-gray-300 dark:text-zinc-200"
            :bordered="false"
            @click="showMore = !showMore"
            checkable
          >
            {{ showMore ? "收起" : "展开" }}
          </NTag>
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
  </AnimeCardBasic>
</template>
