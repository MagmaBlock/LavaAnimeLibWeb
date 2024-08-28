<template>
  <ContainerPageMobileFull>
    <div class="grid grid-cols-1 gap-2 sm:gap-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 sm:gap-4">
        <UserInfoCard />
        <UserFunctionsCard />
      </div>
      <div class="grid grid-cols-1 gap-2 sm:gap-4">
        <AnimeViewHistoryCard :isFullView="false" />
        <UserFollow />
        <VideoTogetherMenu />
        <AdminNav :withCard="true" />
      </div>
    </div>
  </ContainerPageMobileFull>
</template>

<script setup>
useHead({ title: "我的" });
</script>
