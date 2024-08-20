export const useAnimeIndexStore = defineStore("anime-index", () => {
  const currentSelected = ref({
    years: null as string | null,
    sessions: null as string | null,
    platforms: null as string | null,
    regions: null as string | null,
    sort: "view" as string | null,
  });

  const updateSelected = (
    type: keyof typeof currentSelected.value,
    value: string | null
  ) => {
    currentSelected.value[type] = value;
  };

  return { currentSelected, updateSelected };
});
