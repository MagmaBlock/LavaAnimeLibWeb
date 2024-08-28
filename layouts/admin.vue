<template>
  <NLayout has-sider position="absolute">
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
      :native-scrollbar="false"
    >
      <AdminMenu />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader>
        <NavBarTopNav />
      </NLayoutHeader>
      <NLayoutContent :native-scrollbar="false">
        <ContainerPage class="pb-56 lg:pb-0">
          <NuxtPage />
        </ContainerPage>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script lang="ts" setup></script>
