<template>
  <!-- 整个容器 -->
  <div class="w-full h-[125vh] grid place-items-center
    transition duration-500">
    <!-- 中间的框 -->
    <div class="p-8 transition rounded-md shadow-lg mx-auto
    bg-white dark:bg-zinc-800 border dark:border-zinc-800">
      <RouterView></RouterView>
    </div>
    <div class="h-20"></div>
  </div>
</template>

<script>
export default {
  inject: ['background'],
  mounted() {
    if (this.$route.name == 'Auth') {
      this.$router.push({ name: 'AuthLogin' })
    }
    this.background.url = 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&dl=aj-McsNra2VRQQ-unsplash.jpg&w=1920&q=80&fmt=jpg&crop=entropy&cs=tinysrgb'
    this.background.class = 'blur-sm'
    this.background.on = true
  },
  unmounted() {
    this.background.on = false
    setTimeout(() => {
      this.background.url = ''
      this.background.class = ''
    }, 500);
  }
}
</script>