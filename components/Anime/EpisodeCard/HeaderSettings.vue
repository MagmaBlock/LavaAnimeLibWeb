<template>
  <NButtonGroup>
    <NButton secondary size="small" @click="$emit('toggleGrid')">
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
    <NButton secondary size="small" @click="$emit('toggleSort')">
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
defineProps<{
  isGrid: boolean;
  sortAsc: boolean;
}>();

defineEmits<{
  (e: "toggleGrid"): void;
  (e: "toggleSort"): void;
}>();
</script>

<style scoped></style>
