<template>
  <NCard :bordered="false" size="small" title="手动切换节点">
    <NScrollbar class="max-h-[25vh]">
      <div class="grid gap-1">
        <AnimeStorageDisplay
          name="自动"
          description="自动选择"
          @click="updateActiveStorageId('auto')"
          :active="activeStorageId === 'auto'"
        />
        <AnimeStorageDisplay
          v-for="storage in storages.data.value"
          :key="storage.id"
          @click="updateActiveStorageId(storage.id)"
          :name="storage.name"
          :description="storage.description"
          :active="storage.id === activeStorageId"
          :disable="!availableStorageIds.includes(storage.id)"
        />
      </div>
    </NScrollbar>
  </NCard>
</template>

<script lang="ts" setup>
const animeStore = useAnimeStore();

const activeStorageId = computed(() => {
  if (animeStore.activeStorageId === null) {
    return "auto";
  }
  return animeStore.activeStorageId;
});

const updateActiveStorageId = (value: string) => {
  if (value === "auto") {
    animeStore.activeStorageId = null;
    return;
  }
  if (!availableStorageIds.value.includes(value)) {
    return;
  }
  animeStore.activeStorageId = value;
};

const { $client } = useNuxtApp();

const storages = await useAsyncData(
  "getStorageInfomations",
  () => $client.pages.anime.getStorageInfomations.query(),
  {
    immediate: false,
    lazy: true,
  }
);

const availableStorageIds = computed(() => {
  return (
    animeStore.activeSimilarFiles?.files.map((file) => file.storageId) || []
  );
});

onMounted(() => {
  storages.execute();
});
</script>

<style></style>
