<template>
  <div>
    <TopNav title="最近更新"></TopNav>
    <Container>
      <n-h3>LavaAnimeLib 最近更新</n-h3>
      <!-- 宽屏 -->
      <div class="hidden lg:grid grid-cols-2 gap-4">
        <div>
          <n-h5>网页（前端）</n-h5>
          <GitHubCommits :commits="web"></GitHubCommits>
        </div>
        <div>
          <n-h5>服务端（后端）</n-h5>
          <GitHubCommits :commits="server"></GitHubCommits>
        </div>
      </div>
      <!-- 移动 -->
      <n-tabs type="line" animated class="lg:hidden" justify-content="space-evenly">
        <n-tab-pane name="web" tab="网页前端">
          <GitHubCommits :commits="web"></GitHubCommits>
        </n-tab-pane>
        <n-tab-pane name="server" tab="服务后端">
          <GitHubCommits :commits="server"></GitHubCommits>
        </n-tab-pane>
      </n-tabs>
    </Container>
  </div>
</template>
<script>
import axios from 'axios';
import GitHubCommits from '../../components/About/GitHubCommits.vue';
import Container from '../../components/Container.vue';
import TopNav from '../../components/NavBar/TopNav.vue';

export default {
  data() {
    return {
      web: [],
      server: []
    }
  },
  async mounted() {
    document.title = '番剧库最近更新 | 熔岩番剧库 LavaAnimeLib'
    this.web = await this.getGitHubCommits('LavaAnimeLibWeb')
    this.server = await this.getGitHubCommits('LavaAnimeLib')
  },
  methods: {
    async getGitHubCommits(repos) {
      try {
        let result = await axios.get(
          `https://api.github.com/repos/MagmaBlock/${repos}/commits`
        )
        if (result.status == 200) {
          return result.data
        }
      } catch (error) {
        $message.error('从 GitHub API 获取数据失败...\n可能您的网络无法访问 GitHub')
        return []
      }
    }
  },
  components: { TopNav, Container, GitHubCommits }
}
</script>