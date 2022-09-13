<script>
import NavBarIcon from "./NavBarIcon.vue";

export default {
  data() {
    return {
      route: {}
    };
  },
  watch: {
    // 监听全局路由事件
    $route(to, from) {
      console.log("Vue Route to: ", to);
      this.route = {}; // 清空
      this.route[this.$route.name] = true;
    }
  },
  components: { NavBarIcon }
}
</script>

<template>
  <div>
    <!-- 手机 -->
    <div class="lg:hidden fixed bottom-4 z-50 w-full grid">
      <div class="w-11/12 py-2 px-4 place-self-center
      grid grid-cols-4
      bg-white/80 backdrop-blur-lg backdrop-brightness-90 border shadow-lg rounded-xl
      select-none">
        <NavBarIcon iconClass="bi bi-house" lightIconClass="bi bi-house-fill" route="/" title="主页"
          :light="this.route['Home']" />
        <NavBarIcon iconClass="bi bi-search" route="/search" title="搜索" :light="this.route['Search']" />
        <NavBarIcon iconClass="bi bi-collection" lightIconClass="bi bi-collection-fill" route="/index" title="索引"
          :light="this.route['Index']" />
        <NavBarIcon iconClass="bi bi-lightbulb" lightIconClass="bi bi-lightbulb-fill" route="/help" title="帮助"
          :light="this.route['Help']" />
      </div>
    </div>
    <!-- 宽屏 -->
    <div class="hidden lg:block h-full ease-in duration-200 bg-slate-50 hover:bg-slate-100 shadow-xl hover:shadow-2xl">
      <div class="w-[88px] z-50 py-8
        grid grid-cols-1 gap-6">
        <NavBarIcon iconClass="bi bi-house" lightIconClass="bi bi-house-fill" route="/" title="主页"
          :light="this.route['Home']" />
        <NavBarIcon iconClass="bi bi-search" route="/search" title="搜索" :light="this.route['Search']" />
        <NavBarIcon iconClass="bi bi-collection" lightIconClass="bi bi-collection-fill" route="/index" title="索引"
          :light="this.route['Index']" />
        <NavBarIcon iconClass="bi bi-lightbulb" lightIconClass="bi bi-lightbulb-fill" route="/help" title="帮助"
          :light="this.route['Help']" />
      </div>
    </div>
  </div>
</template>
