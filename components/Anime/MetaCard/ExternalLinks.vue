<template>
  <NFlex class="text-sm text-blue-600">
    <a
      :href="'https://bgm.tv/subject/' + bgmId"
      target="_blank"
      referrerpolicy="no-referrer"
      v-if="bgmId"
    >
      <div class="flex place-items-center gap-1">
        <Icon icon="material-symbols:link-rounded" /> 在番组计划中打开
      </div>
    </a>
    <a
      :href="officialWebsite"
      target="_blank"
      referrerpolicy="no-referrer"
      v-if="officialWebsite"
    >
      <div class="flex place-items-center gap-1">
        <Icon icon="material-symbols:link-rounded" /> 作品官网
      </div>
    </a>
  </NFlex>
</template>

<script lang="ts" setup>
defineProps<{
  bgmId?: number | null;
  officialWebsite?: string;
}>();
</script>

<style></style>
