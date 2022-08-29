<template>
  <n-carousel show-arrow draggable class="max-w-sm my-2">
    <template v-for="pic in headerPic">
      <img class="w-full h-60 object-cover" :src="pic.pic">
      {{  pic.pic  }}
    </template>
  </n-carousel>

</template>

<script>
import headerPic from '../../assets/Home/headerPic.js'
export default {
  data() {
    return {
      data: headerPic
    }
  }
}
</script>