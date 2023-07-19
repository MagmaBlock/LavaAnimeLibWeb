<template>
  <ContainerMobileFull>
    <div class="grid grid-cols-1 gap-2 sm:gap-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 sm:gap-4">
        <UserCard />
        <FunctionsCard />
      </div>
      <div class="grid grid-cols-1 gap-2 sm:gap-4">
        <MyViewHistory />
        <MyFollow />
        <AdminLinks :withCard="true" />
      </div>
    </div>
  </ContainerMobileFull>
</template>

<script setup>
import { onMounted } from "vue";
import ContainerMobileFull from "../../components/Layout/PageContainer/ContainerMobileFull.vue";
import UserCard from "../../components/My/User/UserCard.vue";
import FunctionsCard from "../../components/My/FunctionsCard.vue";
import MyViewHistory from "../../components/My/ViewHistory/MyViewHistory.vue";
import MyFollow from "../../components/My/MyFollow.vue";
import AdminLinks from "../../components/Admin/AdminLinks.vue";

onMounted(() => {
  document.title = "我的 | 熔岩番剧库 LavaAnimeLib";
});
</script>
