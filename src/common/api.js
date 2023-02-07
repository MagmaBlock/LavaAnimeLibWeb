import axios from "axios";
import config from "./config";

export const LavaAnimeAPI = axios.create({
    baseURL: config.api.lavaAnime
})
LavaAnimeAPI.interceptors.request.use(function (config) {
    config.headers.Authorization = getToken()
    return config
})
LavaAnimeAPI.interceptors.response.use(
    // 2xx
    function (response) {
        return response
    },
    // !2xx
    function (error) {
        if (error.response.status == 401) { // 未登录处理
            localStorage.removeItem('token')
            $message.warning('尚未登录...')
            // app.$router.push({ name: 'AuthLogin' })
        } else { // 其他错误处理
            if (error.response) {
                $message.error(error.response.data.message)
            }
        }
        return Promise.reject(error)
    }
)


// 获取当前 Token
function getToken() {
    let token = localStorage.getItem('token')
    if (!token) return
    token = JSON.parse(token)
    if (new Date(token.expirationTime) > new Date()) { // 未过期
        return token.value
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
        return await LavaAnimeAPI.post('/v2/anime/follow/list', { status, page, pageSize })
    }

    /**
     * 新增/更新/删除 追番
     * @param {Number} id 
     * @param {Number} status 
     * @param {Boolean} remove 
     */
    async editAnimeFollowAPI(id, status, remove) {
        return LavaAnimeAPI.post('/v2/anime/follow/edit', { id, status, remove })
    }

    /**
     * 获取所有类型的追番数量
     */
    async getAnimeFollowTotalAPI() {
        return LavaAnimeAPI.get('/v2/anime/follow/total')
    }
}

export const lavaAnimeAPIs = new LavaAnimeAPIs()

// 传入 ID Array，获取番剧信息
export async function getAnimesData(array) {
    try {
        return (await LavaAnimeAPI.post("/v2/anime/get", { ids: array })).data;
    }
    catch (error) {
        console.error(error);
    }
}

// 获取头图数据
export async function homeHeaderGet() {
    try {
        let fromAPI = await LavaAnimeAPI.get('/v2/home/header/get');
        if (fromAPI.data.code == 200) return fromAPI.data.data
        else return []
    } catch (error) {
        console.error('请求头图数据失败: ', error)
        return []
    }
}