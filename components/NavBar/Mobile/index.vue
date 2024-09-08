<template>
  <div class="fixed bottom-6 px-4 z-50 w-full">
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
</template>