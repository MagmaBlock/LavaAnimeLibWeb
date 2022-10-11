import axios from "axios";
import config from "./config";

export const LavaAnimeAPI = axios.create({
    baseURL: config.api.lavaAnime
})

// 传入 ID Array，获取番剧信息
export async function getAnimesData(array) {
    try {
        let data = (await LavaAnimeAPI.post("/v2/anime/get", { ids: array })).data;
        return data;
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


// 更新头图数据
export async function homeHeaderUpdate(data, password) {
    try {
        if (!data) return '无数据'
        if (typeof password != 'string') return '密码格式错误'
        let updateAPI = await LavaAnimeAPI.post('/v2/home/header/update', { data, password })
        if (updateAPI.data) return updateAPI.data
    } catch (error) {
        console.error('提交头图数据时发送错误');
        console.error(error);
        return error
    }
}