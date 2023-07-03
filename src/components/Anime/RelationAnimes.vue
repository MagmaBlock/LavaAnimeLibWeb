<template>
  <AnimeBasicCard
    class="px-4 py-2 select-none"
    v-if="store.animeData?.relations && store.animeData?.relations[0]"
  >
    <n-space justify="space-between" class="mb-2">
      <div class="text-base">相关作品</div>
      <div
        @click="relationGrid = !relationGrid"
        class="h-full grid place-items-center active:scale-90 transition-transform cursor-pointer"
      >
        <n-icon :size="20" :depth="2">
          <ViewAgendaOutlined />
        </n-icon>
      </div>
    </n-space>

    <!-- 新版 Grid 展示 -->
    <n-collapse-transition :show="relationGrid">
      <AnimeCardContainer
        :animes="store.animeData?.relations"
        size="small"
      />
    </n-collapse-transition>
    <!-- 旧版展示 -->
    <n-collapse-transition :show="!relationGrid">
      <div
        v-for="anime in store.animeData?.relations"
        class="flex flex-wrap gap-1 my-2"
      >
        <RouterLink :to="'/anime/' + anime.id">
          <div
            class="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer ease-in duration-200 rounded p-2"
          >
            <span
              class="bg-blue-100 text-blue-600 dark:bg-blue-600 dark:bg-opacity-60 dark:text-white text-xs font-medium rounded-sm px-1.5 mr-1"
            >
              {{ anime.relation }}
            </span>
            <span>
              {{ anime.title }}
            </span>
            <span
              v-if="anime.type.bdrip"
              class="bg-blue-100 text-xs text-blue-600 font-medium rounded-sm px-1.5 mx-0.5"
            >
              BDRip
            </span>
            <span
              v-if="anime.type.nsfw"
              class="bg-yellow-100 text-xs text-yellow-600 font-medium rounded-sm px-1.5 mx-0.5"
            >
              NSFW
            </span>
          </div>
        </RouterLink>
      </div>
    </n-collapse-transition>
  </AnimeBasicCard>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { useAnimeStore } from "../../store/Anime";
import AnimeCardContainer from "../Layout/CardContainer/AnimeCardContainer.vue";
import AnimeBasicCard from "./Cards/AnimeBasicCard.vue";
import { ViewAgendaOutlined } from "@vicons/material";

const store = useAnimeStore();

const relationGrid = useStorage("relationGrid", true);
</script>
