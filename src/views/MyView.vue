<template>
  <div class="relative">
    <Container>
      <BasicCard class="px-6 py-4 bg-gray-50 rounded-md mb-4">
        <div class="text-xl mb-2">其他</div>
        <RouterLink to="/help">
          <div class="bg-gray-100 hover:bg-gray-200 rounded-md p-8 max-w-xs grid grid-cols-1">
            <div class="text-gray-700 w-full text-4xl mb-2 text-center">
              <i class="bi bi-book-half"></i>
            </div>
            <div class="text-gray-700 w-full text-center">
              番剧库使用帮助
            </div>
          </div>
        </RouterLink>
      </BasicCard>
      <BasicCard class="px-6 py-4 bg-gray-50 rounded-md">
        <div class="text-xl">我的收藏</div>
        <div class="text-sm text-gray-500 mb-2"></div>
        <FullScreenAnimeCardContainer :animes="myAnimes"></FullScreenAnimeCardContainer>
      </BasicCard>
    </Container>
  </div>
</template>

<script>
import { getAnimesData } from '../common/api';
import BasicCard from '../components/BasicCard.vue';
import Container from '../components/Container.vue';
import { getMyCollections } from '../components/Methods/MyCollections';
import FullScreenAnimeCardContainer from '../components/Container/FullScreenAnimeCardContainer.vue';
export default {
  data() {
    return {
      myAnimes: []
    }
  },
  async mounted() {
    let animes = getMyCollections()
    let animesData = await getAnimesData(animes)
    this.myAnimes = animesData.data
  },
  components: { BasicCard, Container, FullScreenAnimeCardContainer }
}
</script>