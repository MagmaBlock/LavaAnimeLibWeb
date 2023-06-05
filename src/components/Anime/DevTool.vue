<template>
  <AnimeBasicCard class="p-4 mb-4 flex">
    <div class="font-bold">开发模式</div>
    <div class="mx-4 grid place-items-center">
      当前 LavaAnimeID : {{ store.laID }}
    </div>
    <RouterLink
      class="border border-blue-600 text-blue-600 rounded-md px-2 mx-2"
      :to="{
        name: 'Anime',
        params: { la: store.laID - 1 },
        query: { dev: 1 },
      }"
    >
      前一个
    </RouterLink>
    <RouterLink
      class="border border-blue-600 text-blue-600 rounded-md px-2 mx-2"
      :to="{
        name: 'Anime',
        params: { la: store.laID + 1 },
        query: { dev: 1 },
      }"
    >
      后一个
    </RouterLink>
  </AnimeBasicCard>
</template>

<script setup>
import { useAnimeStore } from "../../store/Anime";

const store = useAnimeStore();
</script>
