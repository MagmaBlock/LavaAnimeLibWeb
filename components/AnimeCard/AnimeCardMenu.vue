<template>
  <NList hoverable clickable class="select-none">
    <NListItem>
      <NFlex justify="space-between" :align="'center'">
        <AnimeCardMenuHeadIntro
          v-if="fetchData.data.value"
          :releaseYear="fetchData.data.value.releaseYear"
          :releaseSeason="fetchData.data.value.releaseSeason"
          :region="fetchData.data.value.region"
          :platform="fetchData.data.value.platform"
          :name="fetchData.data.value.name"
          :originalName="fetchData.data.value.originalName"
          :bdrip="fetchData.data.value.bdrip"
          :nsfw="fetchData.data.value.nsfw"
        />
        <AnimeCardMenuGoButton
          v-if="id"
          @click="router.push({ name: 'anime-la', params: { la: id } })"
        />
      </NFlex>
    </NListItem>

    <NListItem>
      <AnimeCardMenuRating
        v-if="fetchData.data.value"
        v-for="rating in fetchData.data.value.ratings"
        :score="rating.score"
        :rank="rating.rank"
        :count="rating.count"
        :source="rating.source"
      />
    </NListItem>

    <NListItem>
      <AnimeCardMenuCollection :animeId="id" />
    </NListItem>

    <NListItem>
      <a
        v-if="fetchData.data.value?.poster"
        :href="fetchData.data.value?.poster"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="flex items-center gap-4">
          <Icon name="material-symbols:image-outline" size="24" />
          查看封面大图
        </div>
      </a>
    </NListItem>

    <NListItem>
      <a
        v-if="bangumiSite"
        :href="'https://bgm.tv/subject/' + bangumiSite.siteId"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="flex items-center gap-4">
          <Icon name="material-symbols:link" size="24" />
          去番组计划查看本作品
        </div>
      </a>
    </NListItem>
  </NList>
</template>

<script setup lang="ts">
const router = useRouter();

const { id } = defineProps<{
  id: number;
}>();

const { $client } = useNuxtApp();

const fetchData = await useAsyncData(
  "anime-card-menu",
  () => $client.components.animeCard.menu.query({ id }),
  { immediate: false },
);

onMounted(() => {
  fetchData.execute();
});

const bangumiSite = computed(() =>
  fetchData.data.value?.sites.find((site) => site.siteType === "Bangumi"),
);
</script>
