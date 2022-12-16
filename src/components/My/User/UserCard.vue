<template>
  <MyBasicCard class="flex sm:px-6 h-32 rounded-md select-none">

    <div class="flex-1 self-center flex" v-if="login">
      <n-avatar class="shrink-0" round :size="72" src="/Transparent_Akkarin.jpg" />
      <div class="mx-4 my-auto flex-1">
        <div class="text-base font-semibold mb-1">{{ userInfo.name }}</div>
        <div class="text-xs opacity-80">{{ userInfo.email }}</div>
      </div>
      <div class="flex-1"></div>
      <div class="grid place-items-center mx-2">
        <!-- 退出登录确认框 -->
        <n-popover trigger="click" style="padding: 0;" placement="bottom">
          <template #trigger>
            <div class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600
            px-4 py-2 text-xs rounded">
              退出
            </div>
          </template>
          <div class="select-none cursor-pointer text-xs px-4 py-2 transition-colors
            bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600" @click="logout">
            在当前设备上登出
          </div>
          <div class="select-none cursor-pointer text-xs px-4 py-2 transition-colors
            bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600" @click="logout(true)">
            在所有设备上登出
          </div>
        </n-popover>
      </div>
    </div>
    <div class="flex-1 self-center flex cursor-pointer" v-else @click="$router.push({ name: 'AuthLogin' })">
      <n-avatar class="shrink-0" round :size="72" src="/Transparent_Akkarin.jpg" />
      <div class="mx-4 my-auto flex-1">
        <div class="text-base font-semibold mb-1">尚未登录</div>
        <div class="text-xs opacity-80">登录发现更多精彩</div>
      </div>
    </div>
  </MyBasicCard>

</template>

<script>
import { LavaAnimeAPI } from '../../../common/api'
import MyBasicCard from '../MyBasicCard.vue'

export default {
  data() {
    return {
      userInfo: {},
      login: false
    }
  },
  methods: {
    async getUserInfo() {
      try {
        let userInfo = await LavaAnimeAPI.get('/v2/user/info')
        console.log('getUserInfo', userInfo);
        if (userInfo.data.code == 200) {
          this.userInfo = userInfo.data.data
          this.login = true
        }
      } catch (error) {
        if (error.response.status == 401) {
          console.log('未登录');
        }
      }
    },
    async logout(all = false) {
      let logout = await LavaAnimeAPI.post('/v2/user/logout', {
        all: all
      })
      if (logout.data.code == 200) {
        $message.success(logout.data.message)
        this.login = false
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  components: { MyBasicCard }
}
</script>