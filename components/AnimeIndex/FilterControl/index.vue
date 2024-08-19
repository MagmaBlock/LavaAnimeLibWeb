<template>
  <NFlex vertical>
    <AnimeIndexFilterControlSelector
      :multiple="false"
      :showNoneSelectedButton="false"
      :items="sortChoices"
      :selected="currentSelected.sort"
      @update:selected="handleSortSelected"
    />
    <AnimeIndexFilterControlSelector
      :multiple="false"
      :showNoneSelectedButton="true"
      noneSelectedButtonText="全部年份"
      :items="
        filters.releaseYears.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      "
      :selected="currentSelected.years"
      @update:selected="handleYearSelected"
    />
    <AnimeIndexFilterControlSelector
      :multiple="false"
      :showNoneSelectedButton="true"
      noneSelectedButtonText="全部季度"
      :items="
        filters.releaseSeasons.map((season) => ({
          value: season.toString(),
          label: season.toString(),
        }))
      "
      :selected="currentSelected.sessions"
      @update:selected="handleSessionSelected"
    />
    <AnimeIndexFilterControlSelector
      :multiple="false"
      :showNoneSelectedButton="true"
      noneSelectedButtonText="全部平台"
      :items="
        filters.platforms.map((platform) => ({
          value: platform.toString(),
          label: platform.toString(),
        }))
      "
      :selected="currentSelected.platforms"
      @update:selected="handlePlatformSelected"
    />
    <AnimeIndexFilterControlSelector
      :multiple="false"
      :showNoneSelectedButton="true"
      noneSelectedButtonText="全部地区"
      :items="
        filters.regions.map((region) => ({
          value: region.toString(),
          label: region.toString(),
        }))
      "
      :selected="currentSelected.regions"
      @update:selected="handleRegionSelected"
    />
  </NFlex>
</template>

<script lang="ts" setup>
const filters = await $fetch("/api/v3/anime-index/filters");

const sortChoices = [
  { label: "最多播放", value: "view" },
  { label: "最多追番", value: "follow" },
  // { label: "最近更新", value: "update" },
  // { label: "最高评分", value: "score" },
];

const animeIndexStore = useAnimeIndexStore();
const { currentSelected, updateSelected } = animeIndexStore;

const handleSelected = (
  type: keyof typeof currentSelected,
  value: string[]
) => {
  updateSelected(type, value);
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
