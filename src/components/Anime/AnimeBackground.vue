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
      backgroundAnimation: 'h-2/3 opacity-0',
      backgroundAnimation2: 'h-full opacity-100',
    };
  },
  methods: {
    updateBackgroundImg(la) {
      if (parseInt(la.bgmid) == 0) {
        this.backgroundImg = 'https://anime-img.5t5.top/assets/no-bgm-bg.jpg/bg'
      } else {
        this.backgroundImg = la.poster.replace('/poster', '') + '/bg'
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
  <div class="fixed top-0 left-0 right-0 -z-50 w-full bg-cover bg-center bg-no-repeat ease duration-500 blur-lg"
    :style="{ backgroundImage: 'url(' + backgroundImg + ')' }" :class="backgroundAnimation"> </div>
</template>
