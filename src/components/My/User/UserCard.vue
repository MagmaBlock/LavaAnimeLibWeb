<template>
  <MyBasicCard class="flex sm:px-6 h-32 rounded-md select-none">
    <div v-if="login" class="flex-1 self-center flex">
      <n-avatar :size="72" :src="userInfo.data?.avatar?.url || '/Transparent_Akkarin.jpg'" class="shrink-0 cursor-pointer"
                round
                @click="$router.push({ name: 'UserInfoAvatar' })"/>
      <div class="mx-4 my-auto flex-1 cursor-pointer" @click="$router.push({ name: 'UserInfoName' })">
        <div class="text-base font-semi-bold mb-1">{{ userInfo.name }}</div>
        <div class="text-xs opacity-80">{{ userInfo.email }}</div>
      </div>
      <div class="flex-1"></div>
      <div class="grid place-items-center mx-2">
        <!-- 退出登录确认框 -->
        <n-dropdown :options="logoutMenu" trigger="hover" @select="logout">
          <n-button secondary strong>
            退出
          </n-button>
        </n-dropdown>
      </div>
    </div>
    <div v-else class="flex-1 self-center flex cursor-pointer" @click="$router.push({ name: 'AuthLogin' })">
      <n-avatar :size="72" class="shrink-0" round src="/Transparent_Akkarin.jpg"/>
      <div class="mx-4 my-auto flex-1">
        <div class="text-base font-semibold mb-1">尚未登录</div>
        <div class="text-xs opacity-80">登录发现更多精彩</div>
      </div>
    </div>
  </MyBasicCard>

</template>

<script>
import {LavaAnimeAPI} from '@/common/api'
import MyBasicCard from '../MyBasicCard.vue'
import {getUserInfo, userInfo} from '@/common/API/user'

export default {
  setup() {
    getUserInfo()
    return {
      userInfo
    }
  },
  data() {
    return {
      login: false,
      logoutMenu: [
        {label: '在当前设备上登出', key: false},
        {label: '在所有设备上登出', key: true}
      ]
    }
  },
  watch: {
    userInfo(newInfo) {
      this.login = !!newInfo?.id // 登录时即为真, 否则为假
    }
  },
  methods: {
    async logout(all = false) {
      let logout = await LavaAnimeAPI.post('/v2/user/logout', {all})
      if (logout.data.code == 200) {
        $message.success(logout.data.message)
        userInfo.value = {}
      }
    }
  },
  mounted() {
  },
  components: {MyBasicCard}
}
</script>