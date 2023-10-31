<template>
  <div
    class="grid grid-cols-1 gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded"
  >
    <slot name="header"></slot>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
