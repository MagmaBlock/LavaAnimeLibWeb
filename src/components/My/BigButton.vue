<template>
  <span>
    <!-- 宽屏 -->
    <div class="hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md 
    hidden sm:grid grid-cols-1">
      <div class="py-4">
        <div class="text-gray-700 dark:text-zinc-100 w-full text-3xl mb-1 text-center">
          <slot name="icon"></slot>
        </div>
        <div class="text-gray-700 dark:text-zinc-100 w-full text-xs text-center">
          <slot name="name"></slot>
        </div>
      </div>
    </div>
    <!-- 手机 -->
    <div class="sm:hidden">
      <div class="text-gray-700 dark:text-zinc-100 w-full text-2xl text-center">
        <slot name="icon"></slot>
      </div>
      <div class="text-gray-700 dark:text-zinc-100 w-full text-xs text-center">
        <slot name="name"></slot>
      </div>
    </div>
  </span>
</template>