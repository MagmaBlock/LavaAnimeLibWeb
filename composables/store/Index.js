import { defineStore } from "pinia";

export const useIndexStore = defineStore("index", {
  state: () => {
    return {
      activityCard: {
        enable: false,
        link: {
          enable: false,
          url: "",
        },
        image: "",
      },
    };
  },
  actions: {
    async getActivity() {
      try {
        let data = await LavaAnimeAPI.get("/v2/site/setting/get", {
          params: { key: "indexActivityCard" },
          noCatch: true,
        });

        this.activityCard = data.data?.data;
      } catch (error) {}
    },
  },
});
