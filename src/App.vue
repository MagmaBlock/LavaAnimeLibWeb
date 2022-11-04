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
          type: "10月秋"
        }
      },
      hideNotice: false
    };
  },
  components: { RouterView, NavBar }
}
</script>

<template>
  <ThemeProvier>
    <div class="bg-zinc-700 text-white text-center py-4 px-8" v-if="!hideNotice">
      <div class="text-lg">【番剧库维护相关公告】</div>
      <p class="mb-1">
        受微软中国大陆云计算运营代理 (世纪互联) 最新的策略调整影响, 目前已不能在中国大陆为各位提供视频播放服务<br>
        番剧库正重新部署视频播放服务至海外, 资源部署需要一定的时间 (约2.5TB, 约一周), 将按年代从2022年10月逐渐恢复<br>
      </p>
      <n-button @click="hideNotice = true" class="text-white" size="small">知道了</n-button>
    </div>
    <div class="flex flex-row flex-nowrap h-screen max-w-[2560px] mx-auto shadow-lg
    dark:bg-neutral-900 text-gray-800 dark:text-zinc-200">
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
  </ThemeProvier>
</template>
<!-- 从 /page/1 => /page/2, 由于这两个路由的 $route.path 并不一样, 所以组件被强制不复用。 -->
<!-- 从 /page?id=1 => /page?id=2, 由于这两个路由的 $route.path 一样, 所以和没设置key属性一样, 会复用组件。 -->
<!-- https://www.cnblogs.com/alyssa-1997/p/12187379.html -->