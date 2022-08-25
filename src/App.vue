<script>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar/NavBar.vue';
export default {
  data() {
    return {
      memory: {
        searchValue: "",
        selectedTab: {
          year: "2022年",
          type: "7月夏"
        }
      }
    };
  },
  components: { RouterView, NavBar }
}
</script>

<template>
  <!-- 当前路由的界面 -->
  <RouterView :memory="this.memory" :key="$route.path" />
  <NavBar />
</template>
<!-- 从 /page/1 => /page/2, 由于这两个路由的 $route.path 并不一样, 所以组件被强制不复用。 -->
<!-- 从 /page?id=1 => /page?id=2, 由于这两个路由的 $route.path 一样, 所以和没设置key属性一样, 会复用组件。 -->
<!-- https://www.cnblogs.com/alyssa-1997/p/12187379.html -->
<style>
</style>
