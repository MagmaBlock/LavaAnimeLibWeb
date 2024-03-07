import { useThrottleFn } from "@vueuse/core";
import axios from "axios";

export const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;

// 后端 API
export const LavaAnimeAPI = axios.create({
  baseURL: apiBaseUrl,
});

const goToLogin = useThrottleFn(() => {
  $message.warning("尚未登录...");
  useRouter().push({ path: "/auth/login" });
}, 5000);

// 请求前置 - 增加验证头
LavaAnimeAPI.interceptors.request.use(function (config) {
  config.headers.Authorization = getToken();
  return config;
});

// 请求响应处理
LavaAnimeAPI.interceptors.response.use(
  // 2xx
  function (response) {
    return response;
  },
  // !2xx
  function (error) {
    // 请求可以在 config 中添加 noCatch 字段禁止错误处理
    if (error?.config?.noCatch) return Promise.reject(error);
    // 未登录处理
    if (error?.response?.status == 401) {
      localStorage.removeItem("token");
      goToLogin();
    }
    // 网络错误
    else if (error.code == "ERR_NETWORK") {
      console.error(error);
      $message.error("无法连接到服务器");
    }
    // 含有错误信息的服务端响应
    else if (error?.response?.data.message) {
      $message.error(error.response.data.message);
    }
    // 其他错误处理
    else {
      console.error("后端请求错误", error);
    }
    return Promise.reject(error);
  }
);

// 获取当前 Token
export function getToken() {
  let token = localStorage.getItem("token");
  if (!token) return;
  token = JSON.parse(token);
  if (new Date(token.expirationTime) > new Date()) {
    // 未过期
    return token.value;
  }
}

class LavaAnimeAPIs {
  /**
   * 获取追番列表
   * @param {Array<Number>} status
   * @param {Number} page
   * @param {Number} pageSize
   */
  async getAnimeFollowListAPI(status, page, pageSize) {
    return await LavaAnimeAPI.post("/v2/anime/follow/list", {
      status,
      page,
      pageSize,
    });
  }

  /**
   * 新增/更新/删除 追番
   * @param {Number} id
   * @param {Number | undefined} status
   * @param {Boolean | undefined} remove
   */
  async editAnimeFollowAPI(id, status, remove) {
    return LavaAnimeAPI.post("/v2/anime/follow/edit", { id, status, remove });
  }

  /**
   * 获取所有类型的追番数量
   */
  async getAnimeFollowTotalAPI() {
    return LavaAnimeAPI.get("/v2/anime/follow/total");
  }
  /**
   * 获取某个番剧的追番情况
   * @param {Number} id
   */
  async getAnimeFollowInfoAPI(id) {
    return LavaAnimeAPI.get("/v2/anime/follow/info", { params: { id } });
  }
}

export const lavaAnimeAPIs = new LavaAnimeAPIs();

// 传入 ID Array，获取番剧信息
export async function getAnimesData(array) {
  if ((Array.isArray(array) && array.length == 0) || !Array.isArray(array))
    return;
  try {
    return (await LavaAnimeAPI.post("/v2/anime/get", { ids: array })).data;
  } catch (error) {
    console.error(error);
  }
}

// 获取头图数据
export async function homeHeaderGet() {
  try {
    let fromAPI = await LavaAnimeAPI.get("/v2/home/header/get");
    if (fromAPI.data.code == 200) return fromAPI.data.data;
    else return [];
  } catch (error) {
    console.error("请求头图数据失败: ", error);
    return [];
  }
}
