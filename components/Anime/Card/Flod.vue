<template>
  <AnimeCardBasic>
    <!-- 标题部分 -->
    <div class="text-base px-0.5" @click="openTab = !openTab">
      <!-- Title -->
      <slot name="title"></slot>
      <!-- Switch Button -->
      <AnimeCardRoundedButton
        class="float-right w-10 h-6 grid place-items-center"
      >
        <Icon name="material-symbols:keyboard-arrow-up" v-show="openTab" />
        <Icon name="material-symbols:keyboard-arrow-down" v-show="!openTab" />
      </AnimeCardRoundedButton>
    </div>
    <!-- 内容部分 -->
    <NCollapseTransition :show="openTab" v-if="openTab !== null" class="my-2">
      <slot></slot>
    </NCollapseTransition>
    <NCollapseTransition :show="!openTab" v-if="$slots.close" class="my-2">
      <slot name="close"></slot>
    </NCollapseTransition>
  </AnimeCardBasic>
</template>

<script>
export default {
  props: {
    mobileShow: {
      // 控制移动端默认是否展开
      type: Boolean,
      default: false,
    },
    desktopShow: {
      // 是否展开，非移动端
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      openTab: null,
    };
  },
  mounted() {
    if (document.body.clientWidth < 1024) {
      // 应用手机端展开设置
      this.openTab = this.mobileShow;
    } else {
      // 应用非移动端设置
      this.openTab = this.desktopShow;
    }
  },
};
</script>
