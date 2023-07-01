<template>
  <div class="hidden lg:block" v-if="pageData.enable">
    <div class="h-[0.5px] bg-gray-200 dark:bg-gray-700 my-6"></div>
    <a :href="pageData.link.url" target="_blank" v-if="pageData.link.enable">
      <img
        :src="pageData.image"
        class="rounded-md transition active:scale-95 hover:brightness-110"
      />
    </a>
    <img
      v-else
      :src="pageData.image"
      class="rounded-md transition active:scale-95 hover:brightness-110"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { LavaAnimeAPI } from "../../common/api";

const pageData = ref({
  enable: false,
  link: {
    enable: false,
    url: "",
  },
  image: "",
});

(async () => {
  try {
    let data = await LavaAnimeAPI.get("/v2/site/setting/get", {
      params: { key: "indexActivityCard" },
    });

    pageData.value = data.data?.data;
  } catch (error) {}
})();
</script>
