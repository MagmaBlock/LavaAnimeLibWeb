<template>
  <BasicCard>
    <div v-for="collection in collections" class="px-4 py-3">
      <div class="mb-2">
        <div class="text-xl"> {{ collection.title }} </div>
        <div class="text-sm text-gray-500"> {{ collection.subtitle }} </div>
      </div>
      <div class="">
        <div v-for="content in collection.content">
          <div class="flex flex-nowrap flex-row-reverse text-gray-600">
            <div class="w-fit"> {{ content.title }} </div>
            <i class="bi bi-arrow-down-circle-fill mr-1"></i>
          </div>
          <AnimeCollectionCards :ids="content.anime" class="flex flex-shrink-0"></AnimeCollectionCards>
        </div>
      </div>
    </div>
  </BasicCard>

</template>

<script>
import collections from '../../../assets/Home/homepage-collections'
import BasicCard from '../../BasicCard.vue'
import AnimeCollectionCards from '../Collection/AnimeCollectionCards.vue';
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