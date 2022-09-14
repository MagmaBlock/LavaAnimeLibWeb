<template>
  <div v-for="collection in collections" class="px-6 sm:px-0 py-1 sm:py-2">
    <div class="flex items-center">
      <div>
        <div class="text-2xl font-semibold"> {{ collection.title }} </div>
        <div class="h-2 w-12 bg-blue-500 rounded-full"></div>
        <!-- <div class="text-sm text-gray-500"> {{ collection.subtitle }} </div> -->
      </div>
      <!--
        后面横线，感觉观感不咋样 
        <div class="border-4 border-gray-100 flex-grow ml-3 h-0 rounded-full">
      </div> -->
    </div>
    <div class="px-2 lg:px-0">
      <div v-for="content in collection.content">
        <div class="flex flex-nowrap flex-row-reverse text-gray-600">
          <div class="w-fit"> {{ content.title }} </div>
          <i class="bi bi-arrow-down-circle-fill mr-1"></i>
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