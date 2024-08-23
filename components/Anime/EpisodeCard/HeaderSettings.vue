<template>
  <NButtonGroup>
    <NButton secondary size="small" @click="toggleGrid">
      <template #icon>
        <NIcon>
          <Icon
            :icon="
              isGrid
                ? 'material-symbols:grid-view-rounded'
                : 'material-symbols:view-list'
            "
          />
        </NIcon>
      </template>
      {{ isGrid ? "网格" : "列表" }}
    </NButton>
    <NButton secondary size="small" @click="toggleSort">
      <template #icon>
        <NIcon>
          <Icon
            :icon="
              sortAsc
                ? 'material-symbols:arrow-upward-rounded'
                : 'material-symbols:arrow-downward-rounded'
            "
          />
        </NIcon>
      </template>
      {{ sortAsc ? "升序" : "降序" }}
    </NButton>
  </NButtonGroup>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isGrid: boolean;
  sortAsc: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isGrid", value: boolean): void;
  (e: "update:sortAsc", value: boolean): void;
}>();

const toggleGrid = () => {
  emit("update:isGrid", !props.isGrid);
};

const toggleSort = () => {
  emit("update:sortAsc", !props.sortAsc);
};
</script>

<style scoped></style>
