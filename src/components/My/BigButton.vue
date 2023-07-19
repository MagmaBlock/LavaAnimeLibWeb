<template>
  <span>
    <!-- 宽屏 -->
    <div
      class="hidden sm:grid py-4 rounded transition hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95"
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
        class="grid place-items-center text-gray-700 dark:text-zinc-100 text-xs w-full transition active:scale-90"
      >
        <n-icon :size="30">
          <slot name="icon"></slot>
        </n-icon>
        <slot name="name"></slot>
      </div>
    </div>
  </span>
</template>
