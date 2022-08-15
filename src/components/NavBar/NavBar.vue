<script>
import NavBarIcon from "./NavBarIcon.vue";

export default {
  data() {
    return {
      route: {}
    }
  },
  watch: {
    $route(to, from) { // 监听路由事件
      console.log('Vue Route to: ', to)
      this.route = {} // 清空
      this.route[this.$route.name] = true
    }
  }
}
</script>

<template>
  <div class="fixed bottom-0 w-full h-16 z-50
  p-2
  flex flex-row flex-nowrap
  bg-white/80 backdrop-blur-lg backdrop-brightness-90
  select-none">
    <NavBarIcon iconClass="bi bi-house" lightIconClass="bi bi-house-fill" route="/" title="主页"
      :light="this.route['Home']">
    </NavBarIcon>
    <NavBarIcon iconClass="bi bi-search" route="/search" title="搜索" :light="this.route['Search']"></NavBarIcon>
    <NavBarIcon iconClass="bi bi-collection" lightIconClass="bi bi-collection-fill" route="/index" title="索引"
      :light="this.route['Index']">
    </NavBarIcon>
    <NavBarIcon iconClass="bi bi-lightbulb" lightIconClass="bi bi-lightbulb-fill" route="/help" title="帮助"
      :light="this.route['Help']"></NavBarIcon>
  </div>
</template>
