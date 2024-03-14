<template>
  <NScrollbar x-scrollable>
    <NBreadcrumb>
      <NBreadcrumbItem :clickable="false">
        <div v-if="year">{{ year }}</div>
        <NSkeleton v-else :width="64"></NSkeleton>
      </NBreadcrumbItem>
      <NBreadcrumbItem :clickable="false">
        <div v-if="type">{{ type }}</div>
        <NSkeleton v-else :width="64"></NSkeleton>
      </NBreadcrumbItem>
      <NBreadcrumbItem :clickable="false">
        <div v-if="name" @click="emits('open-admin-tools')">{{ name }}</div>
        <NSkeleton v-else :width="256"></NSkeleton>
      </NBreadcrumbItem>
    </NBreadcrumb>
  </NScrollbar>
</template>

<script lang="ts" setup>
defineProps({
  year: String,
  type: String,
  name: String,
});

const emits = defineEmits(["open-admin-tools"]);
</script>

<style></style>
