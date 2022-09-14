<template>
  <div v-for="collection in collections" class="px-6 sm:px-0 py-1 sm:py-2">
    <!-- 大标题块 -->
    <div class="flex place-items-end mb-1">
      <div class="text-xl mr-2"> {{ collection.title }} </div>
      <div class="text-sm text-gray-500 mr-4"> {{ collection.subtitle }} </div>
      <!-- 横线  -->
      <div class="hidden md:inline-block flex-grow h-1 bg-gray-100 rounded"></div>
    </div>
    <!-- 内容总块 -->
    <div class="px-2 lg:px-0">
      <!-- 单内容行块 -->
      <div v-for="content in collection.content" class="mb-4">
        <!-- 小标题 -->
        <div class="flex flex-nowrap text-gray-600">
          <i class="bi bi-arrow-down-circle-fill mr-1"></i>
          <div class="w-fit"> {{ content.title }} </div>
        </div>
        <AnimeCollectionCards :ids="content.anime" class="flex flex-shrink-0"></AnimeCollectionCards>
      </div>
    </div>
  </div>

</template>

<script>
import collections from '../../../assets/homepage-collections.js'
import AnimeCollectionCards from '../Collection/AnimeCollectionCards.vue';
import BasicCard from '../../BasicCard.vue'
export default {
  data() {
    return {
      collections: collections,
      page: 0,
      data: {}
    };
  },
  methods: {

  },
  mounted() { },
  components: { BasicCard, AnimeCollectionCards }
}
</script>