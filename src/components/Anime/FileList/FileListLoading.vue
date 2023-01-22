<template>
  <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none cursor-progress">
    <!-- 标题 -->
    <div class="text-base px-0.5 mb-2">正片</div>
    <n-skeleton :sharp="false" class="my-1" size="large"></n-skeleton>
    <n-skeleton :sharp="false" class="w-1/2" size="large"></n-skeleton>
  </AnimeBasicCard>
</template>

<script>
import AnimeBasicCard from '../Cards/AnimeBasicCard.vue';

export default {
  components: {AnimeBasicCard}
}
</script>