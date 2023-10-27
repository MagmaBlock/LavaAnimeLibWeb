// 控制全局背景
export const useBackgroundStore = defineStore("background", {
  state: () => ({
    enable: false,
    imageUrl: "",
    customClass: "",
  }),
  actions: {
    setBackground(backgroundUrl: string) {
      this.enable = true;
      this.imageUrl = backgroundUrl;
    },
    resetBackground() {
      this.enable = false;
      this.imageUrl = "";
      this.customClass = "";
    },
    setCustomClass(customClass: string) {
      this.customClass = customClass;
    },
  },
});
