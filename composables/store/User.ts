import { AxiosError } from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {},
  }),
  actions: {
    async getUserInfo() {
      try {
        let result = await LavaAnimeAPI.get("/v2/user/info");
        if (result.data.code == 200) {
          this.userInfo = result.data.data;
          return this.userInfo;
        }
      } catch (error) {
        if (error instanceof AxiosError && error.status == 401) {
          console.error("用户未登录");
        }
        this.userInfo = {};
        return this.userInfo;
      }
    },
  },
});
