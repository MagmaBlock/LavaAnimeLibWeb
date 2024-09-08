<template>
  <ContainerPageMobileFull>
    <template #head>
      <NavBarTopNav blur />
    </template>
    <AnimeViewHistoryCard :fullView="true" />
    <NBackTop :bottom="120" />
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
useHead({ title: "观看历史" });
</script>
