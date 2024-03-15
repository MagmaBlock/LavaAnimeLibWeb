<template>
  <div class="ml-4">
    <NDropdown trigger="click" :options="menuOptions" @select="handleSelect">
      <div>
        <NButton
          secondary
          size="small"
          v-if="followInfo.status >= 0"
          :loading="loading"
        >
          <template #icon>
            <NIcon>
              <Icon icon="material-symbols:bookmark-remove" />
            </NIcon>
          </template>
          取消
        </NButton>
        <NButton
          secondary
          type="primary"
          size="small"
          v-if="followInfo.status === -1"
          :loading="loading"
        >
          <template #icon>
            <NIcon> <Icon icon="material-symbols:bookmark-add" /> </NIcon>
          </template>
          追番
        </NButton>
      </div>
    </NDropdown>
    <NSkeleton
      :width="72"
      :sharp="false"
      size="small"
      v-if="Object.keys(followInfo).length === 0"
    />
  </div>
</template>

<script setup lang="ts">
const { animeId } = defineProps({
  animeId: { type: [Number], require: true },
});

const followInfo: Ref<any> = ref({});
const loading = ref(false);

watch(
  () => animeId,
  () => {
    getFollowInfo();
  },
  { immediate: true }
);

async function getFollowInfo() {
  if (animeId === undefined) return;

  try {
    let info = await lavaAnimeAPIs.getAnimeFollowInfoAPI(animeId);
    if (info.data.data) {
      followInfo.value = info.data.data;
    }
  } catch (error) {
    followInfo.value = { status: -2 };
  }
}

async function editFollow(status?: number, remove?: boolean) {
  if (animeId === undefined) return;

  loading.value = true;
  try {
    let result = await lavaAnimeAPIs.editAnimeFollowAPI(
      animeId,
      status,
      remove
    );
    if (result.data?.code == 200) {
      loading.value = false;
    }
  } catch (error) {}

  getFollowInfo();
}

const menuOptions = [
  {
    label: () => (followInfo.value?.status >= 0 ? "取消追番" : "添加追番"),
    key: "toggle",
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "设置为 想看",
    key: "0",
  },
  {
    label: "设置为 在看",
    key: "1",
  },
  {
    label: "设置为 看过",
    key: "2",
  },
];

function handleSelect(key: string) {
  if (["0", "1", "2"].includes(key)) {
    editFollow(Number(key), false);
  }
  if (key == "toggle") {
    if (followInfo.value.status >= 0) {
      editFollow(undefined, true);
    } else {
      editFollow(1, false);
    }
  }
}
</script>
