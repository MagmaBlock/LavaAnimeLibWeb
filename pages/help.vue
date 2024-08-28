<template>
  <ContainerPage>
    <template #head>
      <NavBarTopNav title="帮助" blur />
    </template>
    <ContainerPageLeftMenuRightContent>
      <template #left>
        <HelpList
          :article="article"
          :articles="articles"
          @change-article="(a) => changeArticle(a)"
          ref="List"
        />
        <HelpSponsors class="mt-8 hidden lg:block" />
      </template>
      <template #right>
        <HelpMarkdownRender :content="article.content || ''" />
        <HelpSponsors class="mt-8 block lg:hidden" />
      </template>
    </ContainerPageLeftMenuRightContent>
  </ContainerPage>
</template>
<script>
import LavaAnimeLib from "../assets/Help/LavaAnimeLib.md?raw";
import WhyExternalPlayer from "../assets/Help/WhyExternalPlayer.md?raw";
import ExternalPlayerList from "../assets/Help/ExternalPlayerList.md?raw";

export default {
  data() {
    return {
      article: {},
      articles: [
        { id: "LavaAnimeLib", content: LavaAnimeLib },
        { id: "WhyExternalPlayer", content: WhyExternalPlayer },
        { id: "ExternalPlayerList", content: ExternalPlayerList },
      ],
      notSupport: false,
    };
  },
  mounted() {
    useHead({ title: "使用帮助" });

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
      this.$router.replace({ path: "/help", query: { article: a.id } });
    },
  },
};
</script>
