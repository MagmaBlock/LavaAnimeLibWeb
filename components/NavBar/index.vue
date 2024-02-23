<template>
  <div>
    <!-- 手机 -->
    <div class="lg:hidden fixed bottom-6 px-4 z-50 w-full">
      <div
        class="w-full py-2 px-2 place-self-center grid grid-cols-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 bg-opacity-80 dark:bg-opacity-75 backdrop-blur-lg backdrop-brightness-90 dark:backdrop-brightness-75 shadow-md rounded-md select-none"
      >
        <NavBarIcon name="index" title="主页">
          <Icon name="fluent:home-24-regular" />
        </NavBarIcon>
        <NavBarIcon name="search-value" title="搜索">
          <Icon name="fluent:search-24-regular" />
        </NavBarIcon>
        <NavBarIcon name="anime-index" title="索引">
          <Icon name="fluent:collections-24-regular" />
        </NavBarIcon>
        <NavBarIcon name="user" title="我的">
          <Icon name="fluent:library-24-regular" />
        </NavBarIcon>
      </div>
    </div>
    <!-- 宽屏 -->
    <div
      class="hidden lg:flex flex-col w-[84px] h-full py-10 bg-zinc-50 dark:bg-zinc-900"
    >
      <!-- Logo -->
      <div class="grid place-items-center mb-8">
        <NuxtLink to="/">
          <img
            src="/icon.svg"
            alt="Logo"
            class="w-10 h-10 rounded-lg active:brightness-90 active:scale-95 transition"
          />
        </NuxtLink>
      </div>
      <!-- 按钮容器 -->
      <div
        class="flex-1 flex flex-col z-50 select-none overflow-x-hidden overflow-y-auto"
      >
        <NScrollbar>
          <div class="grid grid-cols-1 gap-y-2">
            <NavBarIcon name="index" title="主页">
              <Icon name="fluent:home-24-regular" />
            </NavBarIcon>
            <!-- <NPopover
              trigger="hover"
              placement="right"
              @update:show="closeCanceler"
              ref="searchPop"
            > -->
            <!-- <template #trigger> -->
            <NavBarIcon name="search-value" title="搜索">
              <Icon name="fluent:search-24-regular" />
            </NavBarIcon>
            <!-- </template> -->
            <!-- 在这里使用非异步的此组件，将导致 NuxtAPI 错误 -->
            <!-- <LazyNavBarQuickSearch @close="closePop" ref="searchBar" /> -->
            <!-- </NPopover> -->
            <NavBarIcon name="anime-index" title="索引">
              <Icon name="fluent:collections-24-regular" />
            </NavBarIcon>
            <NavBarIcon name="user" title="我的">
              <Icon name="fluent:library-24-regular" />
            </NavBarIcon>
          </div>
        </NScrollbar>
      </div>
      <!-- 底部按钮 -->
      <div class="grid place-items-center">
        <NavBarDarkModeBotton />
      </div>
    </div>
  </div>
</template>

<script setup>
const searchPop = ref(null);
const searchBar = ref(null);

// 提供给搜索框的关闭 pop 用函数
const closePop = () => {
  if (searchPop.value instanceof NPopover) {
    searchPop.value.setShow(false);
  }
};

// 在搜索框焦点时，防止 pop 被关闭
const closeCanceler = (value) => {
  // TODO
};
</script>
