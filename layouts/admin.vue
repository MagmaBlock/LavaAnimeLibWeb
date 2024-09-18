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
      <NavBarTopNav
        title="管理控制台"
        custom-back
        @back="router.push('/user')"
      />
      <AdminMenu mode="vertical" />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader
        v-if="!breakpoint.greaterOrEqual('lg').value"
        class="sticky top-0 z-10"
      >
        <NavBarTopNav
          title="管理控制台"
          custom-back
          @back="router.push('/user')"
        />
        <AdminMenu mode="horizontal" />
      </NLayoutHeader>
      <NLayoutContent :native-scrollbar="false">
        <ContainerPage>
          <NuxtPage />
        </ContainerPage>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const router = useRouter();
const breakpoint = useBreakpoints(breakpointsTailwind);
</script>
