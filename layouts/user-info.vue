<template>
  <ContainerPage>
    <template #head>
      <NavBarTopNav title="个人信息" />
    </template>
    <ContainerPageLeftMenuRightContent>
      <template #left>
        <NList hoverable clickable bordered>
          <NListItem
            v-for="menuItem in menu"
            @click="router.replace({ path: menuItem.path })"
          >
            {{ menuItem.label }}
          </NListItem>
        </NList>
      </template>
      <template #right>
        <NuxtPage class="max-w-xl"></NuxtPage>
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

document.title = "用户信息 | 熔岩番剧库 LavaAnimeLib";

// 当打开 /user/info 时, 跳转到一个默认页
if (route.name == "UserInfo") {
  router.replace({ path: "/user/info/avater" });
}

const menu = [
  { label: "修改头像", path: "/user/info/avatar" },
  {
    label: "修改用户名",
    path: "/user/info/name",
  },
  { label: "修改密码", path: "/user/info/password" },
];
</script>
