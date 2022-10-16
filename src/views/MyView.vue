<template>
  <div class="relative">
    <Container>
      <FunctionsCard />
      <BasicCard class="px-6 py-4 rounded-md">
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
import FunctionsCard from '../components/My/FunctionsCard.vue';
import settings from '../components/Methods/settings.js'
export default {
  data() {
    return {
      myAnimes: [],
      settings: settings
    }
  },
  async mounted() {
    document.title = '我的 | 熔岩番剧库 LavaAnimeLib'
    let animes = getMyCollections()
    let animesData = await getAnimesData(animes)
    this.myAnimes = animesData.data
  },
  components: { BasicCard, Container, FullScreenAnimeCardContainer, FunctionsCard }
}
</script>