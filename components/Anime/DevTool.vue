<template>
  <AnimeCardBasic class="mb-4">
    <NSpace :align="'center'">
      <div class="font-bold">Debug</div>
      <NDivider vertical />
      <div>LavaAnimeID : {{ store.laID }}</div>
      <NDivider vertical />
      <NuxtLink
        :to="{
          name: 'anime-la',
          params: { la: store.laID - 1 },
          // query: { dev: route.query?.dev },
        }"
      >
        <NButton size="small" secondary> 前一个 </NButton>
      </NuxtLink>
      <NuxtLink
        :to="{
          name: 'anime-la',
          params: { la: store.laID + 1 },
          // query: { dev: route.query?.dev },
        }"
      >
        <NButton size="small" secondary> 后一个 </NButton>
      </NuxtLink>
      <NuxtLink
        :to="{
          name: 'anime-la',
          params: { la: Math.round(Math.random() * 1000) },
          // query: { dev: route.query?.dev },
        }"
      >
        <NButton size="small" secondary> 随机 </NButton>
      </NuxtLink>
    </NSpace>
  </AnimeCardBasic>
</template>

<script setup>
const store = useAnimeStore();
const route = useRoute();
</script>
