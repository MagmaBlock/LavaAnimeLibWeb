<template>
  <NCard :bordered="false" embedded>
    <!-- 已登录的情况 -->
    <div
      class="flex place-items-center gap-4 h-full"
      v-if="userStore.userInfo?.id"
    >
      <NAvatar
        class="shrink-0 cursor-pointer"
        round
        :size="72"
        :src="
          userStore.userInfo.data?.avatar?.url || '/Transparent_Akkarin.jpg'
        "
        @click="router.push({ path: '/user/info/avatar' })"
      />
      <div
        class="cursor-pointer"
        @click="router.push({ path: '/user/info/name' })"
      >
        <div class="text-base font-semibold mb-1">
          {{ userStore.userInfo.name }}
        </div>
        <div class="text-xs opacity-80">{{ userStore.userInfo.email }}</div>
      </div>
      <div class="flex-1"></div>
      <div class="grid place-items-center mx-2">
        <!-- 退出登录确认框 -->
        <NDropdown trigger="hover" :options="logoutMenu" @select="logout">
          <NButton secondary>
            <template #icon>
              <Icon name="material-symbols:exit-to-app" />
            </template>
            登出
          </NButton>
        </NDropdown>
      </div>
    </div>
    <!-- 未登录的情况 -->
    <div
      class="flex place-items-center gap-6 h-full cursor-pointer"
      v-else
      @click="router.push({ path: '/auth/login' })"
    >
      <NAvatar round :size="72" src="/Transparent_Akkarin.jpg" />
      <div>
        <div class="text-base font-semibold mb-1">尚未登录</div>
        <div class="text-xs opacity-80">登录发现更多精彩</div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="jsx">
const router = useRouter();

const userStore = useUserStore();
userStore.getUserInfo();

const logoutMenu = [
  {
    label: "在当前设备上登出",
    key: false,
    icon: () => <Icon name="material-symbols:logout" size="18" />,
  },
];

// 登出
async function logout(all = false) {
  let logout = await LavaAnimeAPI.post("/v2/user/logout", { all });
  if (logout.data.code == 200) {
    $message.success(logout.data.message);
    userStore.userInfo = {};
  }
}
</script>
