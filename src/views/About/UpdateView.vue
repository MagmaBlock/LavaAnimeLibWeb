<template>
  <div>
    <TopNav title="更新日志"></TopNav>
    <Container>
      <div class="text-lg font-medium">熔岩番剧库 最近更新日志</div>
      <div class="opacity-75">LavaAnimeLib 相关项目 GitHub 提交记录</div>
      <n-divider />
      <!-- 宽屏 -->
      <div class="hidden lg:grid grid-cols-2 gap-4">
        <div>
          <n-h5 class="text-center">网页（前端）</n-h5>
          <GitHubCommits :commits="web"></GitHubCommits>
        </div>
        <div>
          <n-h5 class="text-center">服务端（后端）</n-h5>
          <GitHubCommits :commits="server"></GitHubCommits>
        </div>
      </div>
      <!-- 移动 -->
      <div class="lg:hidden">
        <n-tabs type="line" animated justify-content="space-evenly">
          <n-tab-pane name="web" tab="网页前端">
            <GitHubCommits :commits="web"></GitHubCommits>
          </n-tab-pane>
          <n-tab-pane name="server" tab="服务后端">
            <GitHubCommits :commits="server"></GitHubCommits>
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-divider>
        <div class="flex gap-2">
          更多记录见 GitHub
          <n-a target="_blank" href="https://github.com/MagmaBlock/LavaAnimeLibWeb">前端</n-a>
          <n-a target="_blank" href="https://github.com/MagmaBlock/LavaAnimeLib">后端</n-a>
        </div>
      </n-divider>
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