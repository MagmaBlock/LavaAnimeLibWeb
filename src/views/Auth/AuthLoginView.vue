<template>
  <div>
    <div class="text-2xl font-semibold">欢迎回来！</div>
    <div class="opacity-80">使用邮箱 / 用户名登录</div>
    <div class="h-0.5 w-full my-4 rounded-full bg-black dark:bg-white opacity-10"></div>
    <div class="w-72 sm:w-96">
      <n-form @keyup.enter="login">
        <n-form-item label="邮箱 / 用户名">
          <n-input v-model:value="account" type="text" placeholder="邮箱 / 用户名" />
        </n-form-item>
        <n-form-item label="密码">
          <n-input v-model:value="password" type="password" placeholder="密码" />
        </n-form-item>
      </n-form>
      <div class="my-4">
        <RouterLink :to="{ name: 'AuthReg' }" class="float-left">
          <n-button quaternary>
            去注册
          </n-button>
        </RouterLink>
        <n-button strong @click="login" class="float-right">
          登录
        </n-button>
      </div>
    </div>
  </div>
</template>

<script>
import {LavaAnimeAPI} from '@/common/api';

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    async login() {
      if (!this.account || !this.password) {
        $message.warning('缺少参数, 请补全参数再提交')
        return
      }
      try {
        let loginResult = await LavaAnimeAPI.post('/v2/user/login', {
          account: this.account, password: this.password
        });
        if (loginResult.data.code == 200) {
          $message.success(loginResult.data.message)
          let token = loginResult.data.data.token
          localStorage.setItem('token', JSON.stringify(token))
          this.$router.push({ name: 'User' })
        }
      } catch (error) {
        
      }
    },
  },
  mounted() {
    document.title = '登录 | 熔岩番剧库 LavaAnimeLib'
  }
}
</script>
