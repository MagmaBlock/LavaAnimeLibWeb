<template>
  <AnimeFlodCard
    class="px-4 py-2 sm:mb-4 select-none"
    v-if="!store.state.driveData.isLoading"
  >
    <template #title>
      节点
      <span v-if="store.driveData.list.length" class="mx-1 text-sm opacity-75">
        {{ store.driveData.list.length }}个
      </span>
    </template>
    <div class="grid grid-cols-1 gap-1 max-h-[25vh] overflow-y-scroll">
      <template v-for="drive in store.driveData.list">
        <DriveCard
          :active="store.activeDrive?.id == drive.id"
          :name="drive.name"
          :description="drive.description"
          @click="store.changeDrive(drive.id)"
          :disable="store.animeData?.type?.nsfw && drive.banNSFW"
          :loading="store.state.driveLoading == drive.id"
        />
      </template>
    </div>
    <n-checkbox
      v-model:checked="store.myDrive.rememberMyChoice"
      class="mt-2 mx-1"
      size="small"
    >
      记住我的选择
    </n-checkbox>
    <template #close>
      <DriveCard
        :name="store.activeDrive?.name"
        :description="store.activeDrive?.description"
        :disable="store.animeData?.type?.nsfw && store.activeDrive?.banNSFW"
        :loading="!!store.state.driveLoading"
      />
    </template>
  </AnimeFlodCard>
</template>

<script setup>
import AnimeFlodCard from "../Cards/AnimeFlodCard.vue";
import DriveCard from "./DriveCard.vue";
import { useAnimeStore } from "../../../store/Anime";

const store = useAnimeStore();
</script>
