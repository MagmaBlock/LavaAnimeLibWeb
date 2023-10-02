<template>
  <n-card>
    <n-h2> 注册新账户 </n-h2>
    <n-form>
      <n-form-item show-require-mark label="邮箱">
        <n-input v-model:value="email" type="email" placeholder="邮箱" />
      </n-form-item>
      <n-form-item show-require-mark label="用户名">
        <n-input v-model:value="name" type="text" placeholder="用户名" />
      </n-form-item>
      <n-form-item show-require-mark label="密码">
        <n-input v-model:value="password" type="password" placeholder="密码" />
      </n-form-item>
      <n-form-item show-require-mark label="邀请码">
        <n-input
          v-model:value="inviteCode"
          type="text"
          placeholder="邀请码 (必填)"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <RouterLink :to="{ name: 'AuthLogin' }" class="float-left">
        <n-button secondary> 去登录 </n-button>
      </RouterLink>
      <n-button secondary type="primary" @click="register" class="float-right">
        注册
      </n-button>
    </template>
  </n-card>
</template>

<script>
import { LavaAnimeAPI } from "../../common/api.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      name: "",
      inviteCode: "",
    };
  },
  computed: {},
  methods: {
    async register() {
      try {
        if (!this.email || !this.password || !this.name || !this.inviteCode) {
          $message.warning("缺少参数, 请补全参数再提交");
          return;
        }

        let regResult = await LavaAnimeAPI.post("/v2/user/register", {
          email: this.email,
          password: this.password,
          name: this.name,
          inviteCode: this.inviteCode,
        });
        if (regResult.data.code == 200) {
          // 成功注册
          $message.success(regResult.data.message);
          // 开始尝试登录
          let loginResult = await LavaAnimeAPI.post("/v2/user/login", {
            account: this.email,
            password: this.password,
          });
          if (loginResult.data.code == 200) {
            // 成功登录
            $message.success(loginResult.data.message);
            let token = loginResult.data.data.token;
            localStorage.setItem("token", JSON.stringify(token));
            this.$router.push({ name: "User" });
          } else {
            // 注册成功但是登录失败？
            $message.error("注册成功但是登录失败？不管了，先把你传送到登录页");
            this.$router.push({ name: "AuthLogin" });
          }
        }
      } catch (error) {
        // 失败
      }
    },
  },
  mounted() {
    document.title = "登录 | 熔岩番剧库 LavaAnimeLib";
  },
};
</script>
