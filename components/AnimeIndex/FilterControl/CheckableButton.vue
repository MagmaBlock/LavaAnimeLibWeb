<template>
  <div>
    <NButton
      size="small"
      :quaternary="!checked"
      :secondary="checked"
      :type="checked ? 'primary' : 'default'"
    >
      {{ title }}
    </NButton>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  checked: boolean;
}>();
</script>

<style></style>
