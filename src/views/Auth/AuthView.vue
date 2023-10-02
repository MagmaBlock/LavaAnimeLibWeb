<template>
  <div class="h-full grid place-items-center mb-16">
    <div class="max-w-md">
      <!-- 中间的框 -->
      <RouterView class="shadow-lg" />
      <n-card title="本站目前仅登录可用且为邀请制" class="mt-4 shadow-lg">
        本站为个人开发，且并非盈利性质，在 2021
        年创立之初仅计划面向个人和朋友间使用。为避免公开访问造成的资源盗链和不可控，目前采用白名单制，注册需要邀请码。
        <br /><br />
        您可通过 QQ 群、Bangumi 站内私信等方式联系 Magma。
      </n-card>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["background"],
  mounted() {
    if (this.$route.name == "Auth") {
      this.$router.push({ name: "AuthLogin" });
    }
    this.background.url =
      "https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1598063183638-4ffe7c5f0f8d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=j-lee-LYBSBjGo-5s-unsplash.jpg&w=1920";
    this.background.class = "blur-0";
    this.background.on = true;
  },
  unmounted() {
    this.background.on = false;
    setTimeout(() => {
      this.background.url = "";
      this.background.class = "";
    }, 500);
  },
};
</script>
