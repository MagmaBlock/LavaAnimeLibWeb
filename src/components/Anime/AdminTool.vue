<template>
  <NDrawer
    v-model:show="store.showAdminTools"
    placement="bottom"
    :default-height="540"
    resizable
  >
    <NDrawerContent title="番剧库运营工具">
      <n-list bordered>
        <n-list-item>
          <n-thing title="RuleName" :description="getRuleName"> </n-thing>
          <template #suffix>
            <NButton @click="copy(getRuleName)"> 复制 </NButton>
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing title="Path" :description="getPath"> </n-thing>
          <template #suffix>
            <NButton @click="copy(getPath)"> 复制 </NButton>
          </template>
        </n-list-item>
        <n-list-item v-if="store.animeData?.name">
          <n-thing title="Name" :description="store.animeData.name"> </n-thing>
          <template #suffix>
            <NButton @click="copy(store.animeData.name)"> 复制 </NButton>
          </template>
        </n-list-item>
        <n-list-item v-if="store.animeData?.name_cn">
          <n-thing title="NameCN" :description="store.animeData.name_cn">
          </n-thing>
          <template #suffix>
            <NButton @click="copy(store.animeData.name_cn)"> 复制 </NButton>
          </template>
        </n-list-item>
        <n-list-item v-if="getWebsite">
          <n-thing title="Website"> </n-thing>
          <template v-for="url in getWebsite">
            <NA target="_blank" :href="url">
              {{ url }}
            </NA>
            <br />
          </template>
        </n-list-item>
      </n-list>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup>
import { useAnimeStore } from "../../store/Anime";
import { useClipboard } from "@vueuse/core";
import { computed } from "vue";

const store = useAnimeStore();

// 剪贴板工具
const { copy } = useClipboard();
// 计算
const getPath = computed(() => {
  return `C:\\Users\\Administrator\\Downloads\\LavaAnimeLib\\${store.animeData?.index.year}\\${store.animeData?.index.type}\\${store.animeData?.index.name}`;
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
