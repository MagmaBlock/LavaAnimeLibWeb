<template>
  <Container class="grid place-items-center h-screen">
    <n-result status="418" :title="`我只是个${hh ? '吟游诗人' : '杯具'}，又知道什么呢`" :description="hh ? '欸嘿?' : '一切尽在不言中'">
      <template #footer>
        <n-button @click="hh = true">{{ hh ? '欸嘿?' : '接受真相就是这么简单, 这还没写好, 去看看别的吧' }}</n-button>
      </template>
    </n-result>
  </Container>
</template>
<script>
export default {
  data() {
    return {
      hh: false
    }
  },
  mounted() {
    document.title = '帮助 | 熔岩番剧库 LavaAnimeLib'
  }
}
</script>