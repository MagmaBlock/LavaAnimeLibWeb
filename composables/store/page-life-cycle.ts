import { defineStore } from "pinia";

export const usePageLifeCycleStore = defineStore({
  id: "pageLifeCycleStore",
  state: () => ({
    clickCount: 0,
    mountTime: null as Date | null,
  }),
  actions: {
    addClickCount() {
      this.clickCount++;
    },
    setPageMount() {
      this.mountTime = new Date();
    },
  },
});
