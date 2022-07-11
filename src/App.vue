<script>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar/NavBar.vue';
export default {
  data() {
    return {
      memory: { // 全局内存，保存每个界面的选项，使切换界面更加接近 App 体验
        searchValue: '',
        selectedTab: {
          year: '2022年', type: '7月夏'
        }
      }
    }
  }
}
</script>

<template>
  <NavBar />
  <!-- 当前路由的界面 -->
  <RouterView class="mb-16" :memory="this.memory" />
</template>

<style>
</style>
