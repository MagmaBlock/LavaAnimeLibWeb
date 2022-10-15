<template>
  <div v-for="collection in collections" class="px-6 sm:px-0 py-1 sm:py-2">
    <!-- 大标题块 -->
    <div class="flex mb-4">
      <div class="bg-blue-600 w-2 rounded mr-2 lg:mr-4 my-0.5"></div>
      <div class="flex-wrap">
        <div class="text-xl sm:text-[22px] mr-2 font-medium"> {{ collection.title }} </div>
        <div class="text-sm sm:text-base text-gray-500 mr-4"> {{ collection.subtitle }} </div>
      </div>
    </div>
    <!-- 内容总块 -->
    <div class="grid lg:grid-cols-2 gap-4">
      <!-- 单内容块 -->
      <div v-for="content in collection.content"
        class="bg-gray-50 dark:bg-zinc-800 rounded-md h-fit px-4 lg:px-6 py-3 lg:py-4">
        <!-- 小标题 -->
        <div class="flex flex-nowrap md:text-base mb-1">
          <div class="w-fit text-zinc-700 dark:text-zinc-400 font-medium mb-1"> {{ content.title }} </div>
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