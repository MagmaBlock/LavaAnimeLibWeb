<template>
  <AnimeCardBasic>
    <template #header>
      <div class="flex place-items-center" @click="openTab = !openTab">
        <slot name="title"></slot>
        <div class="flex-1"></div>
        <Transition class="cursor-pointer" name="fade" mode="out-in">
          <Icon
            name="material-symbols:keyboard-arrow-up"
            size="16"
            v-if="openTab"
          />
          <Icon name="material-symbols:keyboard-arrow-down" size="16" v-else />
        </Transition>
      </div>
    </template>
    <!-- 内容部分 -->
    <NCollapseTransition :show="openTab" v-if="openTab !== null">
      <slot></slot>
    </NCollapseTransition>
    <NCollapseTransition :show="!openTab" v-if="$slots.close">
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
      openTab: false,
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
