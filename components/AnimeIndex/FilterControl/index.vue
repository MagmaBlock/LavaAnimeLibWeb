<template>
  <div>
    <NFlex vertical v-if="getFilters.data.value">
      <AnimeIndexFilterControlSelector
        :multiple="false"
        :showNoneSelectedButton="false"
        :items="sortChoices"
        :selected="currentSelected.sort ? [currentSelected.sort] : []"
        @update:selected="handleSortSelected"
      />
      <AnimeIndexFilterControlSelector
        :multiple="false"
        :showNoneSelectedButton="true"
        noneSelectedButtonText="全部年份"
        :items="
          getFilters.data.value.releaseYears.map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }))
        "
        :selected="currentSelected.years ? [currentSelected.years] : []"
        @update:selected="handleYearSelected"
      />
      <AnimeIndexFilterControlSelector
        :multiple="false"
        :showNoneSelectedButton="true"
        noneSelectedButtonText="全部季度"
        :items="
          getFilters.data.value.releaseSeasons.map((season) => ({
            value: season.toString(),
            label: season.toString(),
          }))
        "
        :selected="currentSelected.sessions ? [currentSelected.sessions] : []"
        @update:selected="handleSessionSelected"
      />
      <AnimeIndexFilterControlSelector
        :multiple="false"
        :showNoneSelectedButton="true"
        noneSelectedButtonText="全部平台"
        :items="
          getFilters.data.value.platforms.map((platform) => ({
            value: platform.toString(),
            label: platform.toString(),
          }))
        "
        :selected="currentSelected.platforms ? [currentSelected.platforms] : []"
        @update:selected="handlePlatformSelected"
      />
      <AnimeIndexFilterControlSelector
        :multiple="false"
        :showNoneSelectedButton="true"
        noneSelectedButtonText="全部地区"
        :items="
          getFilters.data.value.regions.map((region) => ({
            value: region.toString(),
            label: region.toString(),
          }))
        "
        :selected="currentSelected.regions ? [currentSelected.regions] : []"
        @update:selected="handleRegionSelected"
      />
    </NFlex>
    <NFlex vertical v-if="getFilters.status.value === 'pending'">
      <NSkeleton size="small" v-for="i in 8" :key="i" />
    </NFlex>
    <NResult
      v-if="getFilters.status.value === 'error'"
      status="warning"
      title="获取条件失败"
      description="请稍后再试"
    />
  </div>
</template>

<script lang="ts" setup>
const { $client } = useNuxtApp();

const getFilters = await $client.pages.animeIndex.filters.useQuery();

const sortChoices = [
  { label: "最多播放", value: "view" },
  { label: "最多追番", value: "follow" },
];

const animeIndexStore = useAnimeIndexStore();
const { currentSelected, updateSelected } = animeIndexStore;

const handleSelected = (
  type: keyof typeof currentSelected,
  value: string[]
) => {
  updateSelected(type, value[0] || null);
};

const handleYearSelected = (years: string[]) => handleSelected("years", years);
const handleSessionSelected = (sessions: string[]) =>
  handleSelected("sessions", sessions);
const handlePlatformSelected = (platforms: string[]) =>
  handleSelected("platforms", platforms);
const handleRegionSelected = (regions: string[]) =>
  handleSelected("regions", regions);
const handleSortSelected = (sort: string[]) => handleSelected("sort", sort);
</script>

<style></style>
