<template>
  <div class="flex max-w-[2560px] mx-auto">
    <!-- 导航栏 -->
    <NavBar class="fixed h-screen z-50" />
    <!-- 当前路由的界面 -->
    <!-- 手机端: 自动添加底部 padding; 宽屏: 自动添加导航栏宽度的左 padding -->
    <NScrollbar class="h-screen mx-auto">
      <div class="pb-36 lg:pb-0 lg:pl-[84px]">
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
      </div>
    </NScrollbar>

    <!-- 背景图片和他的特效 -->
    <BackgroundProvider />
  </div>
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
