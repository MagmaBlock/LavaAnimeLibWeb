<template>
  <AnimeBasicCard>
    <div class="text-base px-0.5">
      <!-- Title -->
      <slot name="title"></slot>
      <!-- Switch Button -->
      <RoundedButton class="float-right px-2" @click="openTab = !openTab">
        <i class="bi bi-chevron-up" v-show="openTab"></i>
        <i class="bi bi-chevron-down" v-show="!openTab"></i>
      </RoundedButton>
    </div>
    <n-collapse-transition :show="openTab" v-if="openTab !== null" class="mt-2">
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
  components: { AnimeBasicCard, RoundedButton }
}
</script>