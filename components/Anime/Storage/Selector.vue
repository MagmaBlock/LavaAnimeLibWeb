<template>
  <div class="text-base mb-4">
    存储节点（{{ availableStorageIds.length }} 个）
  </div>
  <NScrollbar class="max-h-[25vh] h-fit">
    <div class="grid gap-1">
      <AnimeStorageDisplay
        name="自动选择"
        description="将为您自动选择合适的节点，首次使用可能需要测速。"
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
  },
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
