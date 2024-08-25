<template>
  <div
    class="relative w-full aspect-w-16 aspect-h-9 bg-black sm:rounded-md overflow-hidden select-none"
  >
    <div class="absolute top-0 w-full h-full" v-show="store.artPlayer">
      <div id="artplayer-app" class="w-full h-full"></div>
    </div>
    <div
      class="w-full h-full bg-black text-white grid place-items-center"
      v-if="!store.artPlayer"
    >
      请选择一个可以播放的视频
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useAnimeVideoPlayerStore();

onBeforeUnmount(() => {
  store.artPlayer?.destroy();
  store.artPlayer = null;
});
</script>

<style scoped></style>
