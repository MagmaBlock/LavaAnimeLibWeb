<template>
  <a :href="href" target="_blank">
    <div
      class="px-2 py-1 h-8 flex place-items-center gap-1 transition-colors rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
    >
      <div class="w-6 h-6" v-if="icon">
        <img :src="icon" alt="icon" />
      </div>
      <div class="text-xs mx-1 whitespace-nowrap">
        <slot></slot>
      </div>
    </div>
    <!-- <n-button tertiary size="tiny" class="">
      <img :src="icon" class="inline-block w-6 h-6" alt="">
      <div class="text-xs">
        <slot name="name"></slot>
      </div>
    </n-button> -->
  </a>
</template>
<script>
export default {
  props: {
    icon: String,
    href: String,
  },
};
</script>
