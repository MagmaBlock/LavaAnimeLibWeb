<template>
  <n-card :bordered="false" embedded>
    <!-- 已登录的情况 -->
    <div class="flex place-items-center gap-4 h-full" v-if="login">
      <n-avatar
        class="shrink-0 cursor-pointer"
        round
        :size="72"
        :src="userInfo.data?.avatar?.url || '/Transparent_Akkarin.jpg'"
        @click="$router.push({ name: 'UserInfoAvatar' })"
      />
      <div
        class="cursor-pointer"
        @click="$router.push({ name: 'UserInfoName' })"
      >
        <div class="text-base font-semibold mb-1">{{ userInfo.name }}</div>
        <div class="text-xs opacity-80">{{ userInfo.email }}</div>
      </div>
      <div class="flex-1"></div>
      <div class="grid place-items-center mx-2">
        <!-- 退出登录确认框 -->
        <n-dropdown trigger="hover" :options="logoutMenu" @select="logout">
          <n-button secondary>
            <template #icon>
              <n-icon>
                <ExitToAppFilled />
              </n-icon>
            </template>
            登出
          </n-button>
        </n-dropdown>
      </div>
    </div>
    <!-- 未登录的情况 -->
    <div
      class="flex place-items-center gap-6 h-full cursor-pointer"
      v-else
      @click="$router.push({ name: 'AuthLogin' })"
    >
      <n-avatar round :size="72" src="/Transparent_Akkarin.jpg" />
      <div>
        <div class="text-base font-semibold mb-1">尚未登录</div>
        <div class="text-xs opacity-80">登录发现更多精彩</div>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { LavaAnimeAPI } from "../../../common/api.js";
import { getUserInfo, userInfo } from "../../../common/API/user.js";
import {
  ExitToAppFilled,
  LaptopFilled,
  DevicesOtherFilled,
} from "@vicons/material";
import { h, ref, watch } from "vue";
import { NIcon } from "naive-ui";

getUserInfo();

const login = ref(false);

const logoutMenu = [
  {
    label: "在当前设备上登出",
    key: false,
    icon: renderIcon(LaptopFilled),
  },
  {
    label: "在所有设备上登出",
    key: true,
    icon: renderIcon(DevicesOtherFilled),
  },
];

// 登出
async function logout(all = false) {
  let logout = await LavaAnimeAPI.post("/v2/user/logout", { all });
  if (logout.data.code == 200) {
    $message.success(logout.data.message);
    userInfo.value = {};
  }
}

function renderIcon(icon) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
}

// 监听用户信息变化, 变换是否登录
watch(userInfo, (newInfo) => {
  login.value = !!newInfo?.id; // 登录时即为真, 否则为假
});
</script>
