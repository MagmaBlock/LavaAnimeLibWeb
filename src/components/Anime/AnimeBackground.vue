<script>
export default {
  props: {
    la: {
      type: Object
    },
  },
  data() {
    return {
      backgroundImg: '',
      backgroundAnimation: 'opacity-0 scale-105',
      backgroundAnimation2: 'opacity-100 scale-110',
    };
  },
  methods: {
    updateBackgroundImg(la) {
      if (!parseInt(la.bgmId)) {
        this.backgroundImg = 'https://anime-img.5t5.top/assets/no-bgm-bg.jpg'
      } else {
        this.backgroundImg = la.images.poster
      }
    },
    applyBackgroundAnimation() {
      setTimeout(() => this.backgroundAnimation = this.backgroundAnimation2, 500);
    }
  },
  mounted() {
    this.updateBackgroundImg(this.la)
    this.applyBackgroundAnimation()
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 right-0 -z-50 w-full h-full bg-cover bg-center bg-no-repeat ease duration-700 blur-md"
    :style="{ backgroundImage: 'url(' + backgroundImg + ')' }" :class="backgroundAnimation"></div>
</template>
