<template>
  <AnimeBasicCard>
    <div class="text-base px-0.5">
      <!-- Title -->
      <slot name="title"></slot>
      <!-- Switch Button -->
      <RoundedButton class="float-right px-2" @click="openTab = !openTab">
        <i v-show="openTab" class="bi bi-chevron-up"></i>
        <i v-show="!openTab" class="bi bi-chevron-down"></i>
      </RoundedButton>
    </div>
    <n-collapse-transition v-if="openTab !== null" :show="openTab" class="mt-2">
      <slot></slot>
    </n-collapse-transition>
  </AnimeBasicCard>
</template>

<script>
import RoundedButton from './RoundedButton.vue';
import AnimeBasicCard from './AnimeBasicCard.vue';

export default {
  props: {
    mobileShow: { // 控制移动端默认是否展开
      type: Boolean,
      default: false
    },
    desktopShow: { // 是否展开，非移动端
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      openTab: null
    }
  },
  mounted() {
    if (document.body.clientWidth < 1024) { // 应用手机端展开设置
      this.openTab = this.mobileShow
    } else { // 应用非移动端设置
      this.openTab = this.desktopShow
    }
  },
  components: {AnimeBasicCard, RoundedButton}
}
</script>