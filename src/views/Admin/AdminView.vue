<template>
  <Container>
    <AdminLinks class="mb-4" />
    <RouterView />
  </Container>
</template>

<script>
import { RouterView } from 'vue-router';
import Container from '../../components/Layout/PageContainer/Container.vue';
import AdminLinks from '../../components/Admin/AdminLinks.vue';

export default {
  mounted() {
    document.title = '管理界面 | 熔岩番剧库 LavaAnimeLib'
    if (this.$route.name == 'Admin') {
      this.$router.replace({ name: 'AdminHeader' })
    }
  },
  components: { RouterView, Container, AdminLinks }
}
</script>