<script setup>
import { RouterLink, RouterView } from 'vue-router';

</script>

<template>

  <RouterLink to="/">Home</RouterLink>
  <!--  <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/mypage">MyPage</RouterLink> -->

  <!-- 当前路由的界面 -->
  <RouterView />
</template>

<style>
</style>
