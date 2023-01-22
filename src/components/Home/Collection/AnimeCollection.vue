<template>
  <div v-for="collection, index in collections" class="px-6 sm:px-0">
    <div v-if="index < showIndex">
      <!-- 大标题块 -->
      <div class="flex my-4">
        <div class="flex-wrap">
          <span class="whitespace-nowrap text-lg mr-2 font-medium"> {{ collection.title }} </span>
          <span class="whitespace-nowrap text-sm sm:text-base opacity-50"> {{ collection.subtitle }} </span>
        </div>
      </div>
      <!-- 内容总块 -->
      <div class="grid lg:grid-cols-1 gap-2">
        <!-- 单内容块 -->
        <div v-for="content in collection.content" class="bg-gray-50 dark:bg-zinc-800 rounded-md px-4 lg:px-6 py-3">
          <!-- 小标题 -->
          <div class="opacity-60 md:text-base font-medium mb-2"> {{ content.title }}</div>
          <AnimeCollectionCards :ids="content.anime" class="flex flex-shrink-0"></AnimeCollectionCards>
        </div>
      </div>
    </div>
    <ShowMoreButton v-else v-if="index == showIndex" :onSee="showAdd"></ShowMoreButton>
  </div>
</template>

<script>
import collections from '../../../assets/homepage-collections.js'
import ShowMoreButton from '../../Container/ShowMoreButton.vue';
import AnimeCollectionCards from '../Collection/AnimeCollectionCards.vue';

export default {
  data() {
    return {
      collections: collections,
      showIndex: 1
    };
  },
  methods: {
    showAdd() {
      this.showIndex = this.showIndex + 2
    }
  },
  mounted() {
  },
  components: {AnimeCollectionCards, ShowMoreButton}
}
</script>