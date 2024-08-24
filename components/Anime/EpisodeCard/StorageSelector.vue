<template>
  <NCard :bordered="false" size="small" title="当前选中的文件在以下节点中可用">
    <NSelect
      :value="activeStorageId"
      @update:value="updateActiveStorageId"
      :options="storagesOptions"
    />
  </NCard>
</template>

<script lang="ts" setup>
import type { SelectOption } from "naive-ui";

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

const storagesOptions = computed(() => {
  return <SelectOption[]>storages.data.value
    ?.map((storage) => ({
      label: storage.name,
      value: storage.id,
      disabled: !animeStore.activeMirrorGroup?.availableStorageIds.includes(
        storage.id
      ),
    }))
    .concat([
      {
        label: "自动",
        value: "auto",
        disabled: false,
      },
    ]);
});

onMounted(() => {
  storages.execute();
});
</script>

<style></style>
