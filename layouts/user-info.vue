<template>
  <NLayout has-sider position="absolute">
    <NLayoutSider
      v-if="breakpoint.greaterOrEqual('lg').value"
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
      :native-scrollbar="false"
    >
      <UserSettingMenu mode="vertical" />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader>
        <NavBarTopNav title="用户设置" />
        <UserSettingMenu
          v-if="!breakpoint.greaterOrEqual('lg').value"
          mode="horizontal"
        />
      </NLayoutHeader>
      <NLayoutContent :native-scrollbar="false">
        <ContainerPage class="pb-56 lg:pb-0">
          <NuxtPage />
        </ContainerPage>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoint = useBreakpoints(breakpointsTailwind);
</script>
