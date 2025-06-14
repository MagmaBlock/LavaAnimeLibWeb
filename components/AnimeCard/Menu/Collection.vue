<template>
  <div>
    <NTabs
      type="segment"
      animated
      size="small"
      :value="currentTab"
      @update:value="toggleFollowStatus"
    >
      <NTab name="NoCollection" tab="未追番"></NTab>
      <NTab name="Plan" tab="想看"></NTab>
      <NTab name="Watching" tab="在看"></NTab>
      <NTab name="Finished" tab="看过"></NTab>
    </NTabs>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  animeId: number;
}>();

const { $client } = useNuxtApp();
const message = useMessage();

const {
  data: followInfo,
  execute: fetchFollowInfo,
  status: followInfoStatus,
} = useAsyncData(
  () =>
    $client.common.animeCollection.getUserAnimeCollectionStatus.query({
      animeId: props.animeId,
    }),
  { immediate: false, lazy: true },
);

const currentTab = computed(() => {
  if (followInfo.value?.status) {
    return followInfo.value.status;
  }
  return "NoCollection";
});

const toggleFollowStatus = async (
  status?: "NoCollection" | "Plan" | "Watching" | "Finished",
) => {
  try {
    await $client.common.animeCollection.toggleUserAnimeCollectionStatus.mutate(
      {
        animeId: props.animeId,
        status: status === "NoCollection" ? undefined : status,
      },
    );
    await fetchFollowInfo();
    message.success("更新成功");
  } catch (error) {
    console.error("更新失败:", error);
    message.error("更新失败");
  }
};

onMounted(() => fetchFollowInfo());
</script>

<style scoped></style>
