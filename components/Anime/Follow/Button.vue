<template>
  <NDropdown trigger="click" :options="menuOptions" @select="handleSelect">
    <NButton
      secondary
      size="small"
      v-if="followInfo?.status"
      :loading="followInfoStatus === 'pending' || isToggling"
    >
      <template #icon>
        <NIcon>
          <Icon name="material-symbols:bookmark-remove" />
        </NIcon>
      </template>
      {{ "取消" }}
    </NButton>
    <NButton
      secondary
      type="primary"
      size="small"
      v-else
      :loading="followInfoStatus === 'pending' || isToggling"
    >
      <template #icon>
        <NIcon> <Icon name="material-symbols:bookmark-add" /> </NIcon>
      </template>
      {{ "追番" }}
    </NButton>
  </NDropdown>
</template>

<script setup lang="ts">
const props = defineProps<{
  animeId: number;
}>();

const { $client } = useNuxtApp();

const {
  data: followInfo,
  execute: fetchFollowInfo,
  status: followInfoStatus,
} = useAsyncData(
  () =>
    $client.common.animeCollection.getUserAnimeCollectionStatus.query({
      animeId: props.animeId,
    }),
  { immediate: false, lazy: true }
);

const isToggling = ref(false);

const toggleFollowStatus = async (
  status?: "Plan" | "Watching" | "Finished"
) => {
  isToggling.value = true;
  try {
    await $client.common.animeCollection.toggleUserAnimeCollectionStatus.mutate(
      {
        animeId: props.animeId,
        status: status,
      }
    );
    await fetchFollowInfo();
  } catch (error) {
    console.error("更新追番状态失败:", error);
  } finally {
    isToggling.value = false;
  }
};

const menuOptions = computed(() => [
  {
    label: "设置为 想看",
    key: "Plan",
    disabled: followInfo.value?.status === "Plan",
  },
  {
    label: "设置为 在看",
    key: "Watching",
    disabled: followInfo.value?.status === "Watching",
  },
  {
    label: "设置为 看过",
    key: "Finished",
    disabled: followInfo.value?.status === "Finished",
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "取消追番",
    key: "toggle",
    disabled: !followInfo.value?.status,
  },
]);

const handleSelect = async (key: string) => {
  if (key === "toggle") {
    await toggleFollowStatus();
  } else {
    await toggleFollowStatus(key as "Plan" | "Watching" | "Finished");
  }
};

watch(
  () => props.animeId,
  () => fetchFollowInfo()
);

onMounted(() => fetchFollowInfo());
</script>
