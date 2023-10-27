export const useSettingsStore = defineStore("settings", {
  state: () => ({
    darkMode: {
      enable: true,
      autoDarkMode: true,
      autoMode: "system",
      darkTime: 19,
      lightTime: 7,
    },
  }),
  getters: {},
  actions: {
    applyTimeDark() {
      if (this.darkMode.autoMode == "time" && this.darkMode.autoDarkMode) {
        let now = new Date().getHours();
        let dark = this.darkMode.darkTime;
        let light = this.darkMode.lightTime;

        // 如果深色开始时间晚于浅色开始时间 (夜晚深色，白天浅色，正常情况)
        if (dark >= light) {
          if (light < now && now <= dark) {
            this.darkMode.enable = false;
          }
          if (dark <= now || now < light) {
            this.darkMode.enable = true;
          }
        }
        // 如果深色开始时间早于浅色开始时间 (夜晚浅色，白天深色，吸血鬼)
        if (dark < light) {
          if (dark < now && now <= light) {
            this.darkMode.enable = true;
          }
          if (light <= now || now < dark) {
            this.darkMode.enable = false;
          }
        }
      }
    },
    applySystemDark(isSystemDark: boolean) {
      if (this.darkMode.autoMode == "system" && this.darkMode.autoDarkMode) {
        this.darkMode.enable = isSystemDark;
      }
    },
  },
  persist: true,
});
