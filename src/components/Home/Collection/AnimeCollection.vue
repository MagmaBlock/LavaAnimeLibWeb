<template>
  <div v-for="collection in collections" class="px-6 sm:px-0 py-1 sm:py-2 ">
    <!-- 大标题块 -->
    <div class="flex h-fit">
      <div class=" bg-yellow-400 w-2 rounded-lg mx-2 my-1"></div>
      <div class="mb-2 flex-wrappl-4">
        <div class="text-xl sm:text-2xl mr-2 font-medium text-gray-800"> {{ collection.title }} </div>
        <div class="text-sm sm:text-base text-gray-500 mr-4"> {{ collection.subtitle }} </div>
        <!-- 横线  -->
        <!-- <div class="hidden md:inline-block flex-grow h-1 bg-gray-100 rounded"></div> -->
      </div>
    </div>
    <!-- 内容总块 -->
    <div class="px-2 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-8">
      <!-- 单内容行块 -->
      <div v-for="content in collection.content" class="mb-4 bg-zinc-50 px-6 py-4 rounded-lg border-slate-100 h-fit">
        <!-- 小标题 -->
        <div class="flex flex-nowrap text-gray-600 md:text-base mb-1">
          <!-- <i class="bi bi-arrow-down-circle-fill mr-1"></i> -->
          <div class="w-fit text-zinc-700 font-medium mb-1"> {{ content.title }} </div>
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
  data () {
    return {
      collections: collections,
      page: 0,
      data: {}
    };
  },
  methods: {

  },
  mounted () { },
  components: { BasicCard, AnimeCollectionCards }
}
</script>