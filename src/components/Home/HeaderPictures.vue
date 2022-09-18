<template>
  <n-carousel show-arrow draggable autoplay class="shadow-lg">
    <template v-for="pic in headerPic">
      <div class="static w-full h-52 sm:h-60">
        <!-- 真图片 -->
        <img class="object-cover w-full min-h-full overflow-hidden" :src="pic.pic">
        <!-- 底部阴影 -->
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/75 "></div>
        <RouterLink class="absolute inline-block inset-x-0 bottom-0 h-[88px] px-5" style="text-shadow: #000 0 0 10px;"
          :to="pic.url">
          <div class="text-white text-lg">
            {{ pic.title }}
          </div>
          <div class="text-gray-300">
            {{ pic.subtitle }}
          </div>
        </RouterLink>
      </div>
    </template>
  </n-carousel>
</template>

<script>
import headerPic from '../../assets/headerPic.js'
export default {
  data() {
    return {
      headerPic: headerPic,
      page: 0
    }
  },
  methods: {},
  mounted() { }
}
</script>