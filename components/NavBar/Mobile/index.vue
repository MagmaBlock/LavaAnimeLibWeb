<template>
  <div
    class="w-full p-2 grid grid-cols-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 select-none"
    @contextmenu.prevent
    @dragstart.prevent
  >
    <NuxtLink to="/">
      <NavBarMobileIcon name="主页" :active="route.name === 'index'">
        <template #icon>
          <Icon name="material-symbols:explore" />
        </template>
      </NavBarMobileIcon>
    </NuxtLink>
    <NuxtLink to="/search">
      <NavBarMobileIcon name="搜索" :active="route.name === 'search-value'">
        <template #icon>
          <Icon name="material-symbols:feature-search" />
        </template>
      </NavBarMobileIcon>
    </NuxtLink>
    <NuxtLink to="/anime-index">
      <NavBarMobileIcon name="索引" :active="route.name === 'anime-index'">
        <template #icon>
          <Icon name="material-symbols:library-books" />
        </template>
      </NavBarMobileIcon>
    </NuxtLink>
    <NuxtLink to="/user">
      <NavBarMobileIcon name="我的" :active="route.name === 'user'">
        <template #icon>
          <Icon name="material-symbols:account-box" />
        </template>
      </NavBarMobileIcon>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>
