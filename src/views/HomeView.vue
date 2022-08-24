<template>
  <Container class="w-full">
    <n-gradient-text type="info" :size="24">
      这里应该有一个主页
    </n-gradient-text><br>
    <n-gradient-text type="danger" :size="18">
      还没写呢
    </n-gradient-text><br>
    <n-gradient-text type="success" :size="18">
      先定个小目标, <br>收录他
      <n-number-animation :from="0" :to="100000000" /> 部番
    </n-gradient-text><br>
    可以点击下方的 搜索和索引<br>看看已经完成的界面~<br>
    <n-collapse>
      <n-collapse-item title="可以折叠哦" name="1">
        <div>可以哦</div>
      </n-collapse-item>
    </n-collapse>
    <n-carousel show-arrow draggable class="max-w-sm my-2">
      <img class="w-full h-60 object-cover"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg">
      <img class="w-full h-60 object-cover"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg">
      <img class="w-full h-60 object-cover"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg">
      <img class="w-full h-60 object-cover"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg">
    </n-carousel>
    <n-switch size="medium" v-model:value="this.switch">
      <template #icon>
        🤔
      </template>
    </n-switch> 哇是{{ this.switch ? '开' : '关' }}关耶
  </Container>
</template>

<script>
export default {
  data() {
    return {
      switch: true
    }
  }
}
</script>

<style>
</style>