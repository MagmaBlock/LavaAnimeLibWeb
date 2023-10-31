<template>
  <a :href="href" target="_blank">
    <AnimeCardButton class="px-2 h-8 flex place-items-center gap-1">
      <div class="w-6 h-6" v-if="icon">
        <img :src="icon" alt="icon" />
      </div>
      <div class="text-xs mx-1 whitespace-nowrap">
        <slot></slot>
      </div>
    </AnimeCardButton>
  </a>
</template>
<script setup>
const props = defineProps({
  icon: String,
  href: String,
});
</script>
