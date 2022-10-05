<template>
  <Container>
    <div class="text-lg font-medium">管理界面</div>
    <div class="mb-4">
      <n-tabs type="line">
        <n-tab name="Header">
          <RouterLink to="/admin/header">
            主页封面设置
          </RouterLink>
        </n-tab>
      </n-tabs>
    </div>
    <RouterView></RouterView>
  </Container>
</template>

<script>
import { RouterView } from 'vue-router';
import Container from '../../components/Container.vue';
export default {
  components: { RouterView, Container },
  mounted() {
    document.title = '管理界面 | 熔岩番剧库 LavaAnimeLib'
  }
}
</script>