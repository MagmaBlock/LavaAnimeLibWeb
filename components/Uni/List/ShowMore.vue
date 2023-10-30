<template>
  <div class="grid place-items-center mt-8" ref="ShowMoreButton" @click="onSee">
    <div
      class="text-gray-500 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 hover:dark:bg-zinc-700 active:bg-gray-300 active:dark:bg-zinc-600 ease-in duration-200 rounded px-12 py-1"
    >
      显示更多
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onSee: Function, // 如果传入此函数, 那么本组件进入浏览器视口中将触发此函数一次
  },
  mounted() {
    if (this.onSee) {
      // 创建一个可见监视器 (浏览器 API)
      const visObserver = new IntersectionObserver((result) => {
        if (result[0].intersectionRatio > 0) {
          // 如果可见度高于 0
          this.onSee();
          visObserver.disconnect(); // 关闭监视器
        }
      });
      visObserver.observe(this.$refs.ShowMoreButton); // 让监视器监视子容器组件
    }
  },
};
</script>
