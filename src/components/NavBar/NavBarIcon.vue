<script>
export default {
  props: {
    // 传入的参数
    iconClass: String, // 此图标默认的 Class
    lightIconClass: String, // 此图标被点亮时的 Class (如果有)
    title: {
      // 此图标的名称
      type: String,
      default: "图标",
    },
    route: {
      // 此图标的路由名称
      type: String,
      default: "",
    },
  },
  computed: {
    realIconClass() {
      // Icon 的 class 应该是什么？
      return this.$route.name == this.route
        ? this.lightIconClass || this.iconClass
        : this.iconClass;
    },
    colorClass() {
      // 现在的 Icon 颜色应该是什么？
      return this.$route.name == this.route
        ? ["text-center", "text-blue-600", "dark:text-blue-500"]
        : [
            "text-center",
            "text-gray-500 dark:text-gray-400",
            "hover:text-black dark:hover:text-gray-200",
          ];
    },
  },
};
</script>

<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="w-full self-center">
    <RouterLink
      :to="{ name: route }"
      :class="colorClass"
      class="ease-in duration-200"
    >
      <div
        class="lg:mx-2 lg:py-2 lg:hover:bg-zinc-200 lg:dark:hover:bg-zinc-700 rounded-md transition"
      >
        <div class="text-[1.25rem] lg:text-[1.35rem] mb-[1px]">
          <i :class="realIconClass"></i>
        </div>
        <div class="text-[10px] lg:text-xs">
          {{ title }}
        </div>
      </div>
    </RouterLink>
  </div>
</template>
