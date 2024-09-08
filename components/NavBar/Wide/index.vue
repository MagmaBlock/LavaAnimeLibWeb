<template>
  <div class="w-16 h-full bg-zinc-50 dark:bg-zinc-900 py-8 flex flex-col">
    <NScrollbar class="flex-grow">
      <NFlex vertical :align="'center'" size="large">
        <!-- Logo -->
        <div class="grid place-items-center">
          <NuxtLink to="/">
            <img
              src="/icon/icon.svg"
              alt="Logo"
              class="w-9 h-9 rounded-lg active:brightness-90 active:scale-95 transition"
            />
          </NuxtLink>
        </div>
        <NavBarWideDivider class="my-4" />
        <!-- 导航类按钮 -->
        <div class="grid grid-cols-1 gap-y-2">
          <NuxtLink to="/">
            <NavBarWideIcon name="主页" :active="route.name === 'index'">
              <template #icon>
                <Icon name="fluent:home-24-regular" />
              </template>
            </NavBarWideIcon>
          </NuxtLink>
          <NuxtLink to="/search">
            <NavBarWideIcon name="搜索" :active="route.name === 'search-value'">
              <template #icon>
                <Icon name="fluent:search-24-regular" />
              </template>
            </NavBarWideIcon>
          </NuxtLink>
          <NuxtLink to="/anime-index">
            <NavBarWideIcon name="索引" :active="route.name === 'anime-index'">
              <template #icon>
                <Icon name="fluent:collections-24-regular" />
              </template>
            </NavBarWideIcon>
          </NuxtLink>
          <NuxtLink to="/user">
            <NavBarWideIcon name="我的" :active="route.name === 'user'">
              <template #icon>
                <Icon name="fluent:library-24-regular" />
              </template>
            </NavBarWideIcon>
          </NuxtLink>
        </div>
        <NavBarWideDivider class="my-4" />
        <NPopover trigger="hover" placement="right" raw>
          <template #trigger>
            <NuxtLink to="/user/history">
              <NavBarWideIcon :active="route.name === 'user-history'">
                <template #icon>
                  <Icon name="fluent:history-24-regular" />
                </template>
              </NavBarWideIcon>
            </NuxtLink>
          </template>
          <NScrollbar class="max-h-96">
            <AnimeViewHistoryCard vertical />
          </NScrollbar>
        </NPopover>
      </NFlex>
    </NScrollbar>

    <!-- 底部按钮 -->
    <div class="py-4 flex justify-center">
      <NavBarWideDarkModeBotton />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>

<style></style>
