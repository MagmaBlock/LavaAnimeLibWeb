<template>
  <div class="h-20 grid place-items-center rounded-md relative
    ease-in transition shadow hover:shadow-lg border border-gray-200">
    <div class="text-center">
      <div class="text-sm">{{ sponsor.name }}</div>
      <div class="text-gray-600 text-xs">{{ sponsor.support }}</div>
    </div>
    <div class="text-gray-600 text-xs px-2 overflow-hidden">{{ sponsor.message }}</div>
    <a target="_blank" :href="sponsor.link" v-if="sponsor.link" class="absolute top-1 right-1">
      <i class="bi bi-link-45deg"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    sponsor: Object
  }
}
</script>