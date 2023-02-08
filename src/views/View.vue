<script>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useMessage, useNotification } from 'naive-ui'

import NavBar from '../components/NavBar/NavBar.vue';

export default {
  provide() {
    return {
      background: computed(() => this.background)
    }
  },
  data() {
    return {
      background: { // 全局背景 config
        on: false, url: '', class: ''
      },
    };
  },
  computed: {
    backgroundClass() {
      return this.background.class ? this.background.class : 'blur-xl'
    }
  },
  methods: {},
  setup() {
    window.$message = useMessage()
    window.$notification = useNotification()
  },
  components: { RouterView, NavBar }
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 transition-colors duration-500">
    <!-- 背景图片和他的特效 -->
    <div class="w-screen h-screen">
      <Transition enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster">
        <img class="w-full h-full scale-110 object-cover dark:brightness-50 
      transition-transform duration-500 ease" :class="backgroundClass" :src="background.url" alt="背景图片"
          v-show="this.background.on">
      </Transition>
    </div>
    <!-- 主视图容器 -->
    <div class="absolute top-0 inset-x-0 h-screen max-w-[2560px] mx-auto
    flex flex-row flex-nowrap select-none 
    shadow-lg text-gray-800 dark:text-zinc-200">
      <!-- 导航栏 -->
      <NavBar />
      <!-- 当前路由的界面 -->
      <div class="relative overflow-y-auto w-full pb-36 lg:pb-0">
        <RouterView v-slot="{ Component }">
          <Transition :name="$route.meta.transition || 'fade'" :mode="$route.meta.mode || 'out-in'">
            <Component :is="Component" class="w-full"></Component>
            <!-- <Component :is="Component" :key="$route.path" class="w-full"></Component> -->
            <!-- 从 /page/1 => /page/2, 由于这两个路由的 $route.path 并不一样, 所以组件被强制不复用。 -->
            <!-- 从 /page?id=1 => /page?id=2, 由于这两个路由的 $route.path 一样, 所以和没设置key属性一样, 会复用组件。 -->
            <!-- https://www.cnblogs.com/alyssa-1997/p/12187379.html -->
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>