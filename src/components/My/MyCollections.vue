<template>
  <MyBasicCard class="sm:px-6 py-4 rounded-md">
    <div class="text-lg">ζηζΆθ</div>
    <div class="text-sm text-gray-500 mb-2"></div>
    <AnimeCardContainer :animes="myAnimes" size="full" />
  </MyBasicCard>
</template>

<script>
import { getAnimesData } from '../../common/api';
import { getMyCollections } from '../../common/Methods/MyCollections';
import AnimeCardContainer from '../Container/AnimeCardContainer.vue';
import MyBasicCard from './MyBasicCard.vue';

export default {
  data() {
    return {
      myAnimes: []
    }
  },
  async mounted() {
    let animes = getMyCollections();
    let animesData = await getAnimesData(animes);
    this.myAnimes = animesData.data;
  },
  components: { AnimeCardContainer, MyBasicCard }
}
</script>