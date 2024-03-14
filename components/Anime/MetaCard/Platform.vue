<template>
  <div class="flex place-items-center gap-1">
    <Icon :name="iconName" v-if="iconName" />
    <Icon icon="material-symbols:export-notes-outline-rounded" v-else />
    <div v-if="platform">
      {{ platform }}
    </div>
    <div v-else>未知类型</div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  platform: {
    type: String,
  },
});

const { platform } = toRefs(props);
const iconName = computed(() => {
  const platFormType = platform?.value?.toLocaleUpperCase();
  if (platFormType == "TV") {
    return "material-symbols:tv-outline";
  }
  if (platFormType == "剧场版") {
    return "material-symbols:movie-outline";
  }
  if (platFormType == "OVA" || platFormType == "OAD") {
    return "material-symbols:package-outline-rounded";
  }
  if (platFormType == "WEB") {
    return "material-symbols:web";
  }
  return "";
});
</script>

<style></style>
