<template>
  <AnimeCardFlod class="select-none" v-if="!store.state.driveData.isLoading">
    <template #title>
      <div>
        节点
        <span
          v-if="store.driveData.list.length"
          class="mx-1 text-xs opacity-75"
        >
          {{ store.driveData.list.length }}个
        </span>
      </div>
    </template>
    <NScrollbar class="max-h-[25vh]">
      <div class="grid gap-1">
        <template v-for="drive in store.driveData.list">
          <AnimeDriveButton
            :name="drive.name"
            :description="drive.description"
            @click="store.changeDrive(drive.id)"
            :disable="store.animeData?.type?.nsfw && drive.banNSFW"
            :loading="store.state.driveLoading == drive.id"
            :active="store.activeDrive?.id == drive.id"
          />
        </template>
      </div>
    </NScrollbar>
    <NCheckbox
      v-model:checked="store.myDrive.rememberMyChoice"
      class="mt-2 mx-1"
      size="small"
    >
      记住我的选择
    </NCheckbox>
    <template #close>
      <AnimeDriveButton
        :name="store.activeDrive?.name"
        :description="store.activeDrive?.description"
        :disable="store.animeData?.type?.nsfw && store.activeDrive?.banNSFW"
        :loading="!!store.state.driveLoading"
      />
    </template>
  </AnimeCardFlod>
</template>

<script setup>
const store = useAnimeStore();
</script>
