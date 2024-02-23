<template>
  <ContainerPage>
    <template #head>
      <NavBarTopNav title="个人信息" />
    </template>
    <ContainerPageLeftMenuRightContent>
      <template #left>
        <NCard :bordered="false" content-style="padding: 0;">
          <NMenu :options="options" @update:value="handlSelect" />
        </NCard>
      </template>
      <template #right>
        <NCard :bordered="false">
          <NuxtPage></NuxtPage>
        </NCard>
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>

<script setup lang="tsx">
import type { MenuOption } from "naive-ui";

const router = useRouter();

const options: MenuOption[] = [
  {
    label: "修改头像",
    key: "/user/info/avatar",
  },
  {
    label: "修改用户名",
    key: "/user/info/name",
  },
  {
    label: "修改密码",
    key: "/user/info/password",
  },
];

const handlSelect = (key: string, item: MenuOption) => {
  router.replace({ path: key });
};
</script>
