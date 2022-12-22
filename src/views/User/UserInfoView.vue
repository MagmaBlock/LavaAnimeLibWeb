<template>
  <div>
    <TopNav title="个人信息"></TopNav>
    <div class="lg:flex lg:flex-nowrap">
      <Container class="basis-1/3">
        <n-list hoverable clickable class="border dark:border-zinc-700 rounded shadow-sm">
          <RouterLink :to="{ name: 'UserInfoAvatar' }" replace>
            <n-list-item>
              修改头像
            </n-list-item>
          </RouterLink>
        </n-list>
      </Container>
      <Container class="basis-2/3">
        <RouterView></RouterView>
      </Container>
    </div>
  </div>
</template>


<script>
import { computed } from 'vue';
import { LavaAnimeAPI } from '../../common/api.js';
import Container from '../../components/Container.vue';
import TopNav from '../../components/NavBar/TopNav.vue';

export default {
  provide() {
    return { userInfo: computed(() => this.userInfo) }
  },
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    async getUserInfo() {
      try {
        let userInfo = await LavaAnimeAPI.get('/v2/user/info')
        console.log('getUserInfo', userInfo);
        if (userInfo.data.code == 200) {
          this.userInfo = userInfo.data.data
        }
      } catch (error) { }
    },
  },
  mounted() {
    document.title = "用户信息 | 熔岩番剧库 LavaAnimeLib";
    this.getUserInfo()
    if (this.$route.name == 'UserInfo') {
      this.$router.replace({ name: 'UserInfoAvatar' })
    }
  },
  components: { TopNav, Container }
}
</script>