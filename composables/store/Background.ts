// 控制全局背景
export const useBackgroundStore = defineStore("background", {
  state: () => ({
    enable: false,
    imageUrl: "",
    customClass: "",
  }),
  actions: {
    setBackground(backgroundUrl: string, customClass?: string) {
      this.enable = true;
      this.imageUrl = backgroundUrl;
      if (customClass) this.customClass = customClass;
    },
    resetBackground() {
      this.enable = false;
      this.imageUrl = "";
      this.customClass = "";
    },
    setCustomClass(customClass: string) {
      this.customClass = customClass;
    },
    setEnable(isEnable: boolean) {
      this.enable = isEnable;
    },
  },
});
