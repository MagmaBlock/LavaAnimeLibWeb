2
<template>
  <div>
    <TopNav title="帮助"></TopNav>
    <Container>
      <div class="lg:flex">
        <div class="lg:basis-1/4 select-none">
          <List
            :article="article"
            :articles="articles"
            @change-article="(a) => changeArticle(a)"
            ref="List"
          />
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
import Container from "../components/Layout/PageContainer/Container.vue";
import List from "../components/Help/List.vue";
import MarkdownRender from "../components/Help/MarkdownRender.vue";
import Sponsors from "../components/Help/Sponsors.vue";

import LavaAnimeLib from "../assets/Help/LavaAnimeLib.md?raw";
import WhyExternalPlayer from "../assets/Help/WhyExternalPlayer.md?raw";
import ExternalPlayerList from "../assets/Help/ExternalPlayerList.md?raw";
import Bangumi from "../assets/Help/Bangumi.md?raw";
import TopNav from "../components/NavBar/TopNav.vue";

export default {
  data() {
    return {
      article: {},
      articles: [
        { id: "LavaAnimeLib", content: LavaAnimeLib },
        { id: "WhyExternalPlayer", content: WhyExternalPlayer },
        { id: "ExternalPlayerList", content: ExternalPlayerList },
        { id: "Bangumi", content: Bangumi },
      ],
      notSupport: false,
    };
  },
  mounted() {
    document.title = "帮助 | 熔岩番剧库 LavaAnimeLib";
    let defaultArticle = this.$route.query.article || "LavaAnimeLib"; // 默认选中文章
    this.articles.forEach((a) => {
      if (a.id == defaultArticle) {
        // 生效上方选中的文章
        this.changeArticle(a);
      }
    });
  },
  methods: {
    changeArticle(a) {
      this.article = a;
      this.$router.replace({ name: "Help", query: { article: a.id } });
    },
  },
  watch: {},
  components: { Container, MarkdownRender, List, Sponsors, TopNav },
};
</script>
