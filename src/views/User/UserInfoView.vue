<template>
  <Container>
    <TopNav title="个人信息"></TopNav>
    <LeftMenuRightContent class="mt-8">
      <template #left>
        <n-list hoverable clickable bordered class="shadow-sm">
          <n-list-item @click="$router.replace({ name: 'UserInfoAvatar' })">
            修改头像
          </n-list-item>
          <n-list-item @click="$router.replace({ name: 'UserInfoName' })">
            修改用户名
          </n-list-item>
          <n-list-item @click="$router.replace({ name: 'UserInfoPassword' })">
            修改密码
          </n-list-item>
        </n-list>
      </template>
      <template #right>
        <RouterView class="max-w-xl"></RouterView>
      </template>
    </LeftMenuRightContent>
  </Container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import Container from "../../components/Layout/PageContainer/Container.vue";
import TopNav from "../../components/NavBar/TopNav.vue";
import LeftMenuRightContent from "../../components/Layout/PageLayout/LeftMenuRightContent.vue";

document.title = "用户信息 | 熔岩番剧库 LavaAnimeLib";

// 当打开 /userinfo 时, 跳转到一个默认页
if (useRoute().name == "UserInfo") {
  useRouter().replace({ name: "UserInfoAvatar" });
}
</script>
