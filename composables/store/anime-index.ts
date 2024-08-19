export const useAnimeIndexStore = defineStore("anime-index", () => {
  const currentSelected = ref({
    years: [] as string[],
    sessions: [] as string[],
    platforms: [] as string[],
    regions: [] as string[],
    sort: ["view"] as string[],
  });

  const updateSelected = (
    type: keyof typeof currentSelected.value,
    value: string[]
  ) => {
    currentSelected.value[type] = value;
  };

  return { currentSelected, updateSelected };
});
