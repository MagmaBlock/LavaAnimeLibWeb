import {ref} from "vue";
import {LavaAnimeAPI} from "../api";

// 响应式的全局用户信息对象. 任何组件调用下方的刷新函数, 此对象都会被响应式更新一次
export const userInfo = ref({})

/**
 * 刷新用户信息
 * @returns {Object} userInfo
 */
export async function getUserInfo() {
    try {
        let result = await LavaAnimeAPI.get('/v2/user/info')
        if (result.data.code == 200) {
            userInfo.value = result.data.data
            return userInfo
        }
    } catch (error) {
        if (error.status == 401) {
            $message.error('未登录')
        }
        userInfo.value = {}
        return userInfo
    }
}
