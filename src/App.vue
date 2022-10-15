<script>
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui'
import NavBar from './components/NavBar/NavBar.vue';
export default {
  data() {
    return {
      memory: {
        searchValue: "",
        selectedTab: {
          year: "2022年",
          type: "10月秋"
        }
      }
    };
  },
  components: { RouterView, NavBar }
}
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="dark">
      <div class="flex flex-row flex-nowrap h-screen max-w-[2560px] shadow-lg
      bg-white dark:bg-neutral-900 text-gray-800 dark:text-white">
        <!-- 导航栏 -->
        <NavBar />
        <!-- 当前路由的界面 -->
        <div class="relative overflow-y-auto w-full">
          <RouterView v-slot="{ Component }">
            <Transition :name="$route.meta.transition || 'fade'" :mode="$route.meta.mode || 'out-in'">
              <Component :is="Component" :memory="this.memory" :key="$route.path" class="w-full"></Component>
            </Transition>
          </RouterView>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>
<!-- 从 /page/1 => /page/2, 由于这两个路由的 $route.path 并不一样, 所以组件被强制不复用。 -->
<!-- 从 /page?id=1 => /page?id=2, 由于这两个路由的 $route.path 一样, 所以和没设置key属性一样, 会复用组件。 -->
<!-- https://www.cnblogs.com/alyssa-1997/p/12187379.html -->