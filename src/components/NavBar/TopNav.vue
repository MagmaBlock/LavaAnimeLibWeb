<template>
  <div
    class="sticky flex flex-nowrap h-12 z-10 select-none transition overflow-hidden rounded-md border dark:border-zinc-700 bg-white bg-opacity-80 dark:bg-zinc-800 dark:bg-opacity-80"
  >
    <div class="flex flex-nowarp">
      <div
        class="grid place-items-center w-12 h-full text-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition cursor-pointer"
        @click="backHandler"
      >
        <i class="bi bi-chevron-left"></i>
      </div>
      <div class="grid place-items-center h-full px-2 text-base">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["back"],
  props: {
    title: {
      type: String,
      default: "返回",
    },
    back: {
      type: [Object, String],
    },
  },
  methods: {
    backHandler() {
      if (this.back) {
        this.$router.push(this.back);
      } else {
        this.$router.back(-1);
      }
    },
  },
};
</script>
