<script>
export default {
  props: { // 传入的参数
    iconClass: String, // 此图标默认的 Class
    lightIconClass: String, // 此图标被点亮时的 Class (如果有)
    title: { // 此图标的名称
      type: String,
      default: '图标'
    },
    route: { // 此图标的路由 (链接)
      type: String,
      default: '/'
    },
    light: Boolean // 此图标是否被点亮
  },
  methods: {
    ifLight() { // 如果此图标已被点亮，则改变控制组件颜色的 Class
      if (this.light) {
        this.colorClass = ['text-center', 'text-blue-600', 'dark:text-blue-500']
        this.realIconClass = this.lightIconClass ? this.lightIconClass : this.iconClass
      } else {
        this.colorClass = ['text-center', 'text-gray-500 dark:text-gray-400', 'hover:text-black dark:hover:text-gray-200']
        this.realIconClass = this.iconClass
      }
    }
  },
  mounted() { // 当 Vue 绑定时判断一次
    this.ifLight()
  },
  watch: { // 监听
    light(newLightState) { // 监听 light 的变化
      this.ifLight()
    }
  },
  data() { // 组件数据
    return {
      colorClass: [], // 负责颜色的 Class
      realIconClass: '', // 最终得出的图标 Class
    }
  }
}
</script>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="w-full self-center">
    <RouterLink :to="route" :class="colorClass" class="ease-in duration-200">
      <div class="lg:mx-2 lg:py-2 lg:hover:bg-slate-200 lg:dark:hover:bg-zinc-700 rounded-md transition">
        <div class="text-[1.25rem] lg:text-[1.35rem] mb-[1px]">
          <i :class="realIconClass"></i>
        </div>
        <div class="text-[10px]">
          {{ title }}
        </div>
      </div>
    </RouterLink>
  </div>
</template>