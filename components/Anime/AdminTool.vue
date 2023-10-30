<template>
  <NDrawer
    v-model:show="store.showAdminTools"
    placement="bottom"
    :default-height="540"
    resizable
  >
    <NDrawerContent title="番剧库运营工具">
      <NList bordered>
        <NListItem>
          <NThing title="RuleName" :description="getRuleName"> </NThing>
          <template #suffix>
            <NButton @click="copy(getRuleName)"> 复制 </NButton>
          </template>
        </NListItem>
        <NListItem>
          <NThing title="Path" :description="getPath"> </NThing>
          <template #suffix>
            <NButton @click="copy(getPath)"> 复制 </NButton>
          </template>
        </NListItem>
        <NListItem v-if="store.animeData?.name">
          <NThing title="Name" :description="store.animeData.name"> </NThing>
          <template #suffix>
            <NButton @click="copy(store.animeData.name)"> 复制 </NButton>
          </template>
        </NListItem>
        <NListItem v-if="store.animeData?.name_cn">
          <NThing title="NameCN" :description="store.animeData.name_cn">
          </NThing>
          <template #suffix>
            <NButton @click="copy(store.animeData.name_cn)"> 复制 </NButton>
          </template>
        </NListItem>
        <NListItem v-if="getWebsite">
          <NThing title="Website"> </NThing>
          <template v-for="url in getWebsite">
            <NA target="_blank" :href="url">
              {{ url }}
            </NA>
            <br />
          </template>
        </NListItem>
      </NList>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup>
import { useClipboard } from "@vueuse/core";

const store = useAnimeStore();

// 剪贴板工具
const { copy } = useClipboard();
// 计算
const getPath = computed(() => {
  return `D:\\Downloads\\LavaAnimeLib\\${store.animeData?.index.year}\\${store.animeData?.index.type}\\${store.animeData?.index.name}`;
});
const getRuleName = computed(() => {
  let month = store.animeData?.index.type.match(/^\d{1,2}/);
  if (!month) {
    month = "other";
  }
  return `【${month}】${store.animeData?.index.name}`;
});
const getWebsite = computed(() => {
  if (!store.animeData?.infobox) return;
  let result = store.animeData?.infobox?.find((kv) => {
    return ["官方网站", "官网", "网站"].includes(kv.key);
  });
  if (result?.value) {
    return [
      result.value,
      result.value + (result.value.endsWith("/") ? "story" : "/story"),
      result.value + (result.value.endsWith("/") ? "episodes" : "/episodes"),
    ];
  } else return;
});
</script>
