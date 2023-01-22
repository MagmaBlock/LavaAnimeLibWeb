<template>
  <Container>
    <div class="text-lg font-medium">管理界面</div>
    <div class="flex flex-wrap gap-4 py-4">
      <template v-for="tab in tabs">
        <div class="px-4 py-2 shadow-md rounded cursor-pointer transition
         hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-zinc-600 dark:active:bg-zinc-700  border dark:border-zinc-600"
             @click="this.$router.push({ name: tab.routeName })">
          {{ tab.name }}
        </div>
      </template>
    </div>
    <RouterView></RouterView>
  </Container>
</template>

<script>
import {RouterView} from 'vue-router';
import Container from '../../components/Container.vue';

export default {
  data() {
    return {
      tabs: [
        {name: '主页头图', routeName: 'AdminHeader'},
        {name: '邀请码生成', routeName: 'AdminInvite'}
      ]
    }
  },
  components: {RouterView, Container},
  mounted() {
    document.title = '管理界面 | 熔岩番剧库 LavaAnimeLib'
    if (this.$route.name == 'Anime') {
      this.$router.push({name: 'AdminHeader'})
    }
  }
}
</script>