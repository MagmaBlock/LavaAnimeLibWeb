<template>
  <Container>
    <div class="lg:flex">
      <div class="lg:basis-1/4 select-none">
        <List :article="article" @change-article="a => article = a" />
        <Sponsors class="mt-8 hidden lg:block" />
      </div>
      <div class="lg:basis-3/4">
        <MarkdownRender :content="article.content || ''" />
      </div>
    </div>
    <Sponsors class="mt-16 block lg:hidden" />
  </Container>
</template>
<script>
import Container from '../components/Container.vue'
import MarkdownRender from '../components/Help/MarkdownRender.vue';
import List from '../components/Help/List.vue';
import Sponsors from '../components/Help/Sponsors.vue';
export default {
  data() {
    return {
      article: {}
    };
  },
  mounted() {
    document.title = "帮助 | 熔岩番剧库 LavaAnimeLib";
  },
  watch: {},
  components: { Container, MarkdownRender, List, Sponsors }
}
</script>