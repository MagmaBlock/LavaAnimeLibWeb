<template>
  <Container>
    <div class="lg:flex">
      <List :article="article" @change-article="a => article = a" class="lg:basis-1/4 lg:mr-16" />
      <MarkdownRender :content="article.content || ''" class="lg:basis-3/4" />
    </div>
  </Container>
</template>
<script>
import Container from '../components/Container.vue'
import MarkdownRender from '../components/Help/MarkdownRender.vue';
import List from '../components/Help/List.vue';
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
  components: { Container, MarkdownRender, List }
}
</script>