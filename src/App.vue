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
    <div class="bg-gray-600 text-white text-center py-4 px-8" v-if="!hideNotice">
      <div class="text-lg">【番剧库暂停播放相关服务公告】</div>
      <p class="mb-2">
        受微软中国区云运营代理（世纪互联）最新的策略调整影响，我们目前已不能继续在中国大陆为各位提供视频播放服务。<br>
        番剧库在建站初期已经预料到这一情况的发生，在接下来的数日内，番剧库将暂停播放相关服务，直至新的文件分发方式被找到。<br>
        番剧库的番剧资源（约2.5TB）仍有完整的备份，部署需要一定的时间（大约数日），<br>
        另外，可能会有一些资源管理相关的代码需要重写，刚好加上最近比较忙，请耐心等待。
      </p>
      <n-button @click="hideNotice = true">关闭</n-button>
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