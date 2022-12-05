<template>
  <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none cursor-progress">
    <!-- 标题 -->
    <div class="text-base px-0.5 mb-2">正片</div>
    <div class="h-10 rounded my-1 bg-gray-200 animate-pulse"></div>
    <div class="h-10 w-1/2 rounded my-1 bg-gray-200 animate-pulse"></div>
  </AnimeBasicCard>
</template>

<script>
import AnimeBasicCard from '../Cards/AnimeBasicCard.vue';

export default {
  components: { AnimeBasicCard }
}
</script>