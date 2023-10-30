<template>
  <AnimeCardBasic
    class="px-4 py-2 select-none"
    v-if="store.animeData?.relations && store.animeData?.relations[0]"
  >
    <NSpace justify="space-between" class="mb-2">
      <div class="text-base">相关作品</div>
      <div
        @click="relationGrid = !relationGrid"
        class="h-full grid place-items-center active:scale-90 transition-transform cursor-pointer"
      >
        <Icon name="material-symbols:grid-on" size="20" />
      </div>
    </NSpace>

    <!-- 新版 Grid 展示 -->
    <NCollapseTransition :show="relationGrid">
      <ContainerAnimeCard :animes="store.animeData?.relations" size="small" />
    </NCollapseTransition>
    <!-- 旧版展示 -->
    <NCollapseTransition :show="!relationGrid">
      <div
        v-for="anime in store.animeData?.relations"
        class="flex flex-wrap gap-1 my-2"
      >
        <NuxtLink
          :to="{
            name: 'anime-la',
            params: {
              la: anime.id,
            },
          }"
        >
          <div
            class="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer ease-in duration-200 rounded p-2"
          >
            <span
              class="bg-blue-100 text-blue-600 dark:bg-blue-600 dark:bg-opacity-60 dark:text-white text-xs font-medium rounded px-1.5 mr-1"
            >
              {{ anime.relation }}
            </span>
            <span>
              {{ anime.title }}
            </span>
            <span
              v-if="anime.type.bdrip"
              class="bg-blue-100 text-xs text-blue-600 font-medium rounded px-1.5 mx-0.5"
            >
              BDRip
            </span>
            <span
              v-if="anime.type.nsfw"
              class="bg-yellow-100 text-xs text-yellow-600 font-medium rounded px-1.5 mx-0.5"
            >
              NSFW
            </span>
          </div>
        </NuxtLink>
      </div>
    </NCollapseTransition>
  </AnimeCardBasic>
</template>

<script setup>
import { useStorage } from "@vueuse/core";

const store = useAnimeStore();

const relationGrid = useStorage("relationGrid", true);
</script>
