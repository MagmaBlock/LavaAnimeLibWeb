<script setup>
import DarkModeBotton from "./DarkModeBotton.vue";
import NavBarIcon from "./NavBarIcon.vue";
</script>

<template>
  <div>
    <!-- 手机 -->
    <div class="lg:hidden fixed bottom-4 z-50 w-full grid">
      <div
        class="w-11/12 py-2 px-4 place-self-center grid grid-cols-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 bg-opacity-80 dark:bg-opacity-75 backdrop-blur-lg backdrop-brightness-90 dark:backdrop-brightness-75 shadow-lg rounded-xl select-none transition-all duration-700"
      >
        <NavBarIcon
          iconClass="bi bi-house"
          lightIconClass="bi bi-house-fill"
          route="Home"
          title="主页"
        />
        <NavBarIcon iconClass="bi bi-search" route="Search" title="搜索" />
        <NavBarIcon
          iconClass="bi bi-collection"
          lightIconClass="bi bi-collection-fill"
          route="Index"
          title="索引"
        />
        <NavBarIcon
          iconClass="bi bi-subtract"
          lightIconClass="bi bi-subtract"
          route="User"
          title="我的"
        />
      </div>
    </div>
    <!-- 宽屏 -->
    <div class="hidden lg:block h-full py-8 pl-4">
      <div
        class="lg:flex lg:flex-col w-20 z-50 h-full py-10 rounded-xl border dark:border-zinc-700 select-none shadow-lg transition bg-white dark:bg-zinc-800 bg-opacity-90 dark:bg-opacity-90"
      >
        <!-- Logo -->
        <div class="grid place-items-center mb-8">
          <RouterLink to="/">
            <img
              src="/icon.svg"
              alt="LavaAnimeLib Logo"
              class="w-10 h-10 rounded-lg shadow-lg shadow-orange-300 dark:shadow-orange-700"
            />
          </RouterLink>
        </div>
        <!-- 按钮 -->
        <div class="grid grid-cols-1 gap-2">
          <NavBarIcon
            iconClass="bi bi-house"
            lightIconClass="bi bi-house-fill"
            route="Home"
            title="主页"
          />
          <NavBarIcon iconClass="bi bi-search" route="Search" title="搜索" />
          <NavBarIcon
            iconClass="bi bi-collection"
            lightIconClass="bi bi-collection-fill"
            route="Index"
            title="索引"
          />
          <NavBarIcon
            iconClass="bi bi-subtract"
            lightIconClass="bi bi-subtract"
            route="User"
            title="我的"
          />
        </div>
        <!-- 占位 -->
        <div class="flex-1"></div>
        <!-- 底部按钮 -->
        <div class="grid place-items-center">
          <DarkModeBotton />
        </div>
      </div>
    </div>
  </div>
</template>
