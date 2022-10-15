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
          <div v-if="notSupport" class="grid mt-4">
            <div class="bg-gray-200 dark:bg-zinc-700 px-4 py-2 w-fit rounded-md text-xs place-self-center">
              当前浏览器版本过旧, 下方帮助排版可能显示不正常!
            </div>
          </div>
          <MarkdownRender :content="article.content || ''" />
        </div>
      </div>
      <Sponsors class="mt-16 block lg:hidden" />
    </Container>
  </div>
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
    // 对低版本浏览器发出警告
    let ua = uaParser()
    console.log(ua.engine);
    if (ua.engine.name == 'Blink' && parseInt(ua.engine.version) < 82) {
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