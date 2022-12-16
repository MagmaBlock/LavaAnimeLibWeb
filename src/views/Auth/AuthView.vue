<template>
  <div class="w-full h-full overflow-y-scroll bg-cover bg-center"
    style="background-image: url('https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&dl=aj-McsNra2VRQQ-unsplash.jpg&w=1920&q=80&fmt=jpg&crop=entropy&cs=tinysrgb');">
    <!-- 登录框 -->
    <div class="w-full h-[110vh] grid place-items-center
    transition duration-500 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
      <div class="transition
        bg-white dark:bg-zinc-800 border dark:border-zinc-800
        rounded-md p-8 shadow-lg ">
        <RouterView></RouterView>
      </div>
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$route.name == 'Auth') {
      this.$router.push({ name: 'AuthLogin' })
    }
  }
}
</script>