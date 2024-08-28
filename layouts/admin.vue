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
      <AdminMenu mode="vertical" />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader>
        <NavBarTopNav title="后台管理" />
        <AdminMenu
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
