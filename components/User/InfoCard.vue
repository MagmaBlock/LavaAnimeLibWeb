<template>
  <NCard :bordered="false" embedded>
    <!-- 已登录的情况 -->
    <div class="flex place-items-center gap-4 h-full" v-if="userInfo">
      <NAvatar
        class="shrink-0 cursor-pointer"
        round
        :size="72"
        :src="userInfo.avatar ?? '/Transparent_Akkarin.jpg'"
        fallback-src="/Transparent_Akkarin.jpg"
        @click="router.push({ path: '/user/info/avatar' })"
      />
      <div
        class="cursor-pointer"
        @click="router.push({ path: '/user/info/name' })"
      >
        <div class="text-base font-semibold mb-1">{{ userInfo.name }}</div>
        <div class="text-xs opacity-80">{{ userInfo.email }}</div>
      </div>
      <div class="flex-1"></div>
      <div class="grid place-items-center mx-2">
        <!-- 退出登录确认框 -->
        <NPopconfirm
          @positive-click="handleLogout"
          positive-text="确认"
          negative-text="取消"
        >
          <template #trigger>
            <NButton secondary>
              <template #icon>
                <Icon name="material-symbols:exit-to-app" />
              </template>
              登出
            </NButton>
          </template>
          确定要退出登录吗？
        </NPopconfirm>
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

<script setup lang="ts">
import { NPopconfirm, NButton, NAvatar, NCard } from "naive-ui";

const router = useRouter();
const nuxtApp = useNuxtApp();

const { data: userInfo } = await useAsyncData("userInfo", () =>
  nuxtApp.$client.pages.user.infoCard.query()
);

// 处理登出
async function handleLogout(): Promise<void> {
  // 删除 localStorage 中的 token
  localStorage.removeItem("token");

  // 跳转到登录页面
  await router.push("/auth/login");
}
</script>
