<template>
  <div>
    <div class="sticky top-0 flex flex-nowrap h-12 z-10 select-none
      bg-white dark:bg-zinc-800 bg-opacity-80 backdrop-blur-lg backdrop-brightness-90
      border-b dark:border-zinc-900 shadow-sm">
      <div class="flex flex-nowarp">
        <div class="grid place-items-center w-12 h-full text-lg
          hover:bg-gray-200 dark:hover:bg-zinc-700
          rounded-md cursor-pointer" @click="$router.back(-1)">
          <i class="bi bi-chevron-left"></i>
        </div>
        <div class="grid place-items-center h-full px-2 text-base">
          <div>
            帮助
          </div>
        </div>
      </div>
    </div>
    <Container>
      <div class="lg:flex">
        <div class="lg:basis-1/4 select-none">
          <List :article="article" :articles="articles" @change-article="a => changeArticle(a)" ref="List" />
          <Sponsors class="mt-8 hidden lg:block" />
        </div>
        <div class="lg:basis-3/4">
          <MarkdownRender :content="article.content || ''" />
        </div>
      </div>
      <Sponsors class="mt-16 block lg:hidden" />
    </Container>
  </div>
</template>
<script>
import Container from '../components/Container.vue'
import List from '../components/Help/List.vue';
import MarkdownRender from '../components/Help/MarkdownRender.vue';
import Sponsors from '../components/Help/Sponsors.vue';

import LavaAnimeLib from '../assets/Help/LavaAnimeLib.md?raw';
import WhyExternalPlayer from '../assets/Help/WhyExternalPlayer.md?raw'
import ExternalPlayerList from '../assets/Help/ExternalPlayerList.md?raw'
export default {
  data() {
    return {
      article: {},
      articles: [
        { id: 'LavaAnimeLib', content: LavaAnimeLib },
        { id: 'WhyExternalPlayer', content: WhyExternalPlayer },
        { id: 'ExternalPlayerList', content: ExternalPlayerList }
      ],
      notSupport: false
    };
  },
  mounted() {
    document.title = "帮助 | 熔岩番剧库 LavaAnimeLib";
    let defaultArticle = this.$route.query.article || 'LavaAnimeLib' // 默认选中文章
    this.articles.forEach(a => {
      if (a.id == defaultArticle) { // 生效上方选中的文章
        this.changeArticle(a)
      }
    })
  },
  methods: {
    changeArticle(a) {
      this.article = a
      this.$router.replace({ name: "Help", query: { article: a.id } });
    }
  },
  watch: {},
  components: { Container, MarkdownRender, List, Sponsors }
}
</script>