<template>
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



    let login = localStorage.getItem('token')
    if (!login) {
      $notification.warning({
        title: "本站目前仅登录可用且为邀请制",
        content: `由于本站为个人开发，且并非盈利性质，在 2021 年创立之初仅计划面向少量用户使用。
因资源盗用情况逐渐增多，考虑将在 2022年 12 月 21 日后调整至登录可用。

注册需要邀请码，若您在 QQ 群内，请直接联系 Magma；
若您是通过 Bangumi 了解到本站，请通过 Bangumi 站内私信获得邀请码；
若您是通过其他方式了解到本站，请通过相应方式联系我。`,
        meta: "已登录的用户不会显示本消息"
      })
    }
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