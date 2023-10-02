<template>
  <n-card>
    <n-h2>
      欢迎回来！
      <n-h3>使用邮箱 / 用户名登录</n-h3>
    </n-h2>
    <div class="h-4"></div>
    <n-form @keyup.enter="login">
      <n-form-item show-require-mark label="邮箱 / 用户名">
        <n-input
          v-model:value="account"
          type="text"
          placeholder="邮箱 / 用户名"
        />
      </n-form-item>
      <n-form-item show-require-mark label="密码">
        <n-input v-model:value="password" type="password" placeholder="密码" />
      </n-form-item>
    </n-form>
    <template #action>
      <RouterLink :to="{ name: 'AuthReg' }" class="float-left">
        <n-button secondary> 去注册 </n-button>
      </RouterLink>
      <n-button secondary type="primary" @click="login" class="float-right">
        登录
      </n-button>
    </template>
  </n-card>
</template>

<script>
import { AxiosError } from "axios";
import { LavaAnimeAPI } from "../../common/api.js";

export default {
  data() {
    return {
      account: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (!this.account || !this.password) {
        $message.warning("缺少参数, 请补全参数再提交");
        return;
      }
      try {
        let loginResult = await LavaAnimeAPI.post("/v2/user/login", {
          account: this.account,
          password: this.password,
        });
        if (loginResult.data.code == 200) {
          $message.success(loginResult.data.message);
          let token = loginResult.data.data.token;
          localStorage.setItem("token", JSON.stringify(token));
          this.$router.push({ name: "User" });
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          if (error.response?.data?.message) {
            $message.error(error.response?.data?.message);
          } else if (error.message) {
            $message.error("无法发送网络请求: " + error.message);
          }
        } else {
          $message.error("发生意外错误");
        }
      }
    },
  },
  mounted() {
    document.title = "登录 | 熔岩番剧库 LavaAnimeLib";
  },
};
</script>
