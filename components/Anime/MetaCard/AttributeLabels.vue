<template>
  <NSpace :size="4">
    <NTag size="small" :bordered="false" type="info" v-if="bdrip"> BD </NTag>
    <NTag size="small" :bordered="false" type="warning" v-if="nsfw">
      NSFW
    </NTag>
  </NSpace>
</template>

<script lang="ts" setup>
defineProps({
  bdrip: {
    type: Boolean,
  },
  nsfw: {
    type: Boolean,
  },
});
</script>

<style></style>
