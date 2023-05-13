<template>
  <span>
    <!-- 宽屏 -->
    <div
      class="hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md hidden sm:grid grid-cols-1 py-4"
    >
      <div
        class="grid place-items-center text-gray-700 dark:text-zinc-100 text-xs w-full text-center"
      >
        <n-icon :size="40">
          <slot name="icon"></slot>
        </n-icon>
        <slot name="name"></slot>
      </div>
    </div>
    <!-- 手机 -->
    <div class="sm:hidden">
      <div
        class="grid place-items-center text-gray-700 dark:text-zinc-100 text-xs w-full text-center"
      >
        <n-icon :size="30">
          <slot name="icon"></slot>
        </n-icon>
        <slot name="name"></slot>
      </div>
    </div>
  </span>
</template>
