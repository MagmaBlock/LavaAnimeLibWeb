<template>
  <ContainerMobileFull>
    <div class="grid grid-cols-1 lg:grid-cols-2 sm:gap-4 sm:mb-4">
      <UserCard class="px-6"/>
      <FunctionsCard class="px-4"/>
    </div>
    <MyCollections class="px-6"/>
  </ContainerMobileFull>
</template>

<script>
import ContainerMobileFull from '../../components/ContainerMobileFull.vue';
import FunctionsCard from '../../components/My/FunctionsCard.vue';
import MyCollections from '../../components/My/MyCollections.vue';
import UserCard from '../../components/My/User/UserCard.vue';

export default {
  data() {
    return {}
  },
  methods: {},
  async mounted() {
    document.title = '我的 | 熔岩番剧库 LavaAnimeLib'
  },
  components: {FunctionsCard, UserCard, MyCollections, ContainerMobileFull}
}
</script>