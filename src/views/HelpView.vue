<template>
  <Container>
    <div class="lg:flex">
      <div class="lg:basis-1/4 select-none">
        <List :article="article" :articles="articles" @change-article="a => changeArticle(a)" ref="List" />
        <Sponsors class="mt-8 hidden lg:block" />
      </div>
      <div class="lg:basis-3/4">
        <div class="grid">
          <div v-if="notSupport" class="bg-gray-200 px-4 py-2 w-fit rounded-md text-xs place-self-center">
            当前浏览器版本过旧, 下方帮助排版可能显示不正常!
          </div>
        </div>
        <MarkdownRender :content="article.content || ''" />
      </div>
    </div>
    <Sponsors class="mt-16 block lg:hidden" />
  </Container>
</template>
<script>
import uaParser from 'ua-parser-js';

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
      ]
    };
  },
  mounted() {
    document.title = "帮助 | 熔岩番剧库 LavaAnimeLib";
    let defaultArticle = this.$route.query.article || 'LavaAnimeLib'
    this.articles.forEach(a => {
      if (a.id == defaultArticle) {
        this.changeArticle(a)
      }
    })
    let ua = uaParser()
    console.log(ua.engine);
    if (ua.engine.name == 'Blink' && parseInt(ua.engine.version) < 80) {
      this.notSupport = true
    }
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