<template>
  <div class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md 
    grid grid-cols-1">
    <div class="p-6">
      <div class="text-gray-700 dark:text-zinc-100 w-full text-3xl mb-1 text-center">
        <slot name="icon"></slot>
      </div>
      <div class="text-gray-700 dark:text-zinc-100 w-full text-xs text-center">
        <slot name="name"></slot>
      </div>
    </div>
  </div>
</template>