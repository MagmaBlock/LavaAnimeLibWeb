<template>
  <div
    class="absolute inset-x-0 bottom-10 h-[88px] px-5 flex flex-col-reverse"
    style="text-shadow: #000 0 0 10px"
  >
    <div class="text-white text-lg" v-if="title">
      {{ title }}
    </div>
    <div class="text-gray-300" v-if="subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "subtitle"],
};
</script>
