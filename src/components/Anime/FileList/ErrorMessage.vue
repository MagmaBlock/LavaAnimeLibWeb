<template>
  <AnimeBasicCard class="py-8 sm:mb-4" v-if="store.state.fileData.errorCode">
    <n-result
      status="info"
      title="出现错误"
      :description="
        store.state.fileData.errorCode +
        '  ' +
        store.state.fileData.errorMessage
      "
    >
      <template #footer>
        <n-button @click="retry">重试</n-button>
      </template>
    </n-result>
  </AnimeBasicCard>
</template>

<script setup>
import { useAnimeStore } from "../../../store/Anime";
import AnimeBasicCard from "../Cards/AnimeBasicCard.vue";

const store = useAnimeStore();

const retry = async () => {
  await store.getFileData(store.laID, store.activeDrive.id);
  store.autoPlay();
};
</script>
