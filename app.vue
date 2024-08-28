<template>
  <ThemeProvider>
    <NaiveUIProvider>
      <DefaultLayout>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </DefaultLayout>
      <VideoTogetherProvider />
    </NaiveUIProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - 熔岩番剧库 LavaAnimeLib`
      : "熔岩番剧库 LavaAnimeLib";
  },
});

const pageLifeCycleStore = usePageLifeCycleStore();
pageLifeCycleStore.mountTime = new Date();
window.addEventListener("click", () => {
  pageLifeCycleStore.clickCount++;
});
</script>
