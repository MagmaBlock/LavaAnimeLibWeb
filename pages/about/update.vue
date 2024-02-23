<template>
  <ContainerPage>
    <template #head>
      <NavBarTopNav title="更新日志"></NavBarTopNav>
    </template>
    <div class="text-lg font-medium">熔岩番剧库 最近更新日志</div>
    <div class="opacity-75">LavaAnimeLib 相关项目 GitHub 提交记录</div>
    <NDivider />
    <!-- 宽屏 -->
    <div class="hidden lg:grid grid-cols-2 gap-4">
      <div>
        <NH5 class="text-center">网页（前端）</NH5>
        <AboutGitHubCommits :commits="web"></AboutGitHubCommits>
      </div>
      <div>
        <NH5 class="text-center">服务端（后端）</NH5>
        <AboutGitHubCommits :commits="server"></AboutGitHubCommits>
      </div>
    </div>
    <!-- 移动 -->
    <div class="lg:hidden">
      <NTabs type="line" animated justify-content="space-evenly">
        <NTabPane name="web" tab="网页前端">
          <AboutGitHubCommits :commits="web"></AboutGitHubCommits>
        </NTabPane>
        <NTabPane name="server" tab="服务后端">
          <AboutGitHubCommits :commits="server"></AboutGitHubCommits>
        </NTabPane>
      </NTabs>
    </div>
    <NDivider>
      <div class="flex gap-2">
        更多记录见 GitHub
        <NA
          target="_blank"
          href="https://github.com/MagmaBlock/LavaAnimeLibWeb"
        >
          前端
        </NA>
        <NA target="_blank" href="https://github.com/MagmaBlock/LavaAnimeLib">
          后端
        </NA>
      </div>
    </NDivider>
  </ContainerPage>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      web: [],
      server: [],
    };
  },
  async mounted() {
    useHead({ title: "番剧库最近更新" });
    this.web = await this.getGitHubCommits("LavaAnimeLibWeb");
    this.server = await this.getGitHubCommits("LavaAnimeLib");
  },
  methods: {
    async getGitHubCommits(repos) {
      try {
        let result = await axios.get(
          `https://api.github.com/repos/MagmaBlock/${repos}/commits`
        );
        if (result.status == 200) {
          return result.data;
        }
      } catch (error) {
        $message.error(
          "从 GitHub API 获取数据失败...\n可能您的网络无法访问 GitHub"
        );
        return [];
      }
    },
  },
};
</script>
