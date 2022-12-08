<script>
import DarkModeBotton from "./DarkModeBotton.vue";
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
  components: { NavBarIcon, DarkModeBotton }
}
</script>

<template>
  <div>
    <!-- 手机 -->
    <div class="lg:hidden fixed bottom-4 z-50 w-full grid">
      <div class="w-11/12 py-2 px-4 place-self-center
      grid grid-cols-4
      bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-75 backdrop-blur-lg backdrop-brightness-90 dark:backdrop-brightness-75
      border dark:border-zinc-700 shadow-lg rounded-xl
      select-none">
        <NavBarIcon iconClass="bi bi-house" lightIconClass="bi bi-house-fill" route="/" title="主页"
          :light="this.route['Home']" />
        <NavBarIcon iconClass="bi bi-search" route="/search" title="搜索" :light="this.route['Search']" />
        <NavBarIcon iconClass="bi bi-collection" lightIconClass="bi bi-collection-fill" route="/index" title="索引"
          :light="this.route['Index']" />
        <NavBarIcon iconClass="bi bi-subtract" lightIconClass="bi bi-subtract" route="/my" title="我的"
          :light="this.route['My']" />
      </div>
    </div>
    <!-- 宽屏 -->
    <div class="hidden lg:flex lg:flex-col w-20 h-full z-50 py-10 
      ease-in duration-200 select-none
      bg-white bg-opacity-90 dark:bg-zinc-800 dark:bg-opacity-100
      shadow-lg">
      <!-- Logo -->
      <div class="grid place-items-center mb-8">
        <RouterLink to="/">
          <img src="/icon.svg" alt="LavaAnimeLib Logo"
            class="w-10 h-10 rounded-lg shadow-lg shadow-orange-300 dark:shadow-orange-700">
        </RouterLink>
      </div>
      <!-- 按钮 -->
      <div class="grid grid-cols-1 gap-2">
        <NavBarIcon iconClass="bi bi-house" lightIconClass="bi bi-house-fill" route="/" title="主页"
          :light="this.route['Home']" />
        <NavBarIcon iconClass="bi bi-search" route="/search" title="搜索" :light="this.route['Search']" />
        <NavBarIcon iconClass="bi bi-collection" lightIconClass="bi bi-collection-fill" route="/index" title="索引"
          :light="this.route['Index']" />
        <NavBarIcon iconClass="bi bi-subtract" lightIconClass="bi bi-subtract" route="/my" title="我的"
          :light="this.route['My']" />
      </div>
      <!-- 占位 -->
      <div class="flex-1"></div>
      <!-- 底部按钮 -->
      <div class="grid grid-cols-1 place-items-center">
        <DarkModeBotton></DarkModeBotton>
      </div>
    </div>
  </div>
</template>
