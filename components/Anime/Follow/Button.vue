<template>
  <div class="ml-4">
    <NDropdown trigger="click" :options="menuOptions">
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
          {{ "取消" }}
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
          {{ "追番" }}
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
const followInfo: Ref<any> = ref({
  status: -1,
});
const loading = ref(false);

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
</script>
