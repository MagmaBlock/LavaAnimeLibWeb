<!-- 传入一串 IDs，自动渲染番剧卡片，将自动获取数据-->
<template>
  <ContainerAnimeCard
    ref="container"
    :animes="data"
    size="full"
    :fake-number="ids?.length ?? 10"
  >
  </ContainerAnimeCard>
</template>

<script>
export default {
  props: {
    ids: Array,
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    // 创建一个可见监视器 (浏览器 API)
    const visObserver = new IntersectionObserver((result) => {
      if (result[0].intersectionRatio > 0) {
        // 如果可见度高于 0
        this.getData();
        visObserver.disconnect(); // 关闭监视器
      }
    });
    visObserver.observe(this.$refs.container.$el); // 让监视器监视子容器组件
  },
  methods: {
    async getData() {
      let result = await getAnimesData(this.ids);
      // 根据播放量进行排序
      this.data = result.data.sort((a, b) => {
        return b.views - a.views;
      });
    },
  },
};
</script>
