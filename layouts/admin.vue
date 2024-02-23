<template>
  <NLayout>
    <NLayoutHeader>
      <ContainerPage>
        <AdminNav />
      </ContainerPage>
    </NLayoutHeader>
    <NLayoutContent>
      <ContainerPage>
        <NuxtPage />
      </ContainerPage>
    </NLayoutContent>
  </NLayout>
</template>

<script lang="ts" setup>
onMounted(() => {
  document.title = "管理界面 | 熔岩番剧库 LavaAnimeLib";
});
</script>
