<template>
  <ContainerMobileFull>
    <div class="grid grid-cols-1 lg:grid-cols-2 sm:gap-4 sm:mb-4">
      <UserCard class="px-6" />
      <FunctionsCard class="px-4" />
    </div>
    <MyFollow class="px-6 my-4" />
    <MyCollections class="px-6" />
    <AdminLinks class="mx-6 sm:mx-0" />
  </ContainerMobileFull>
</template>

<script>
import ContainerMobileFull from '../../components/ContainerMobileFull.vue';
import FunctionsCard from '../../components/My/FunctionsCard.vue';
import MyCollections from '../../components/My/MyCollections.vue';
import AdminLinks from '../../components/Admin/AdminLinks.vue';
import UserCard from '../../components/My/User/UserCard.vue';
import MyFollow from '../../components/My/MyFollow.vue';

export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {
    document.title = '我的 | 熔岩番剧库 LavaAnimeLib'
  },
  components: { FunctionsCard, UserCard, MyCollections, ContainerMobileFull, AdminLinks, MyFollow }
}
</script>