<template>
  <Transition name="fade">
    <div class="fixed inset-0 -z-50" v-if="background.enable">
      <img
        class="w-full h-full scale-110 object-cover dark:brightness-50"
        :class="background.customClass"
        :src="background.imageUrl"
        alt="背景图片"
      />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const background = useBackgroundStore();

useHeadSafe({
  bodyAttrs: {
    class: "dark:bg-[#101014] text-gray-800 dark:text-zinc-200 select-none",
  },
});
</script>

<style></style>
