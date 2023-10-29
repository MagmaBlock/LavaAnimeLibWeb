<template>
  <NCard>
    <NH2>
      欢迎回来！
      <NH3>使用邮箱 / 用户名登录</NH3>
    </NH2>
    <div class="h-4"></div>
    <NForm @keyup.enter="login">
      <NFormItem show-require-mark label="邮箱 / 用户名">
        <NInput
          v-model:value="account"
          type="text"
          placeholder="邮箱 / 用户名"
        />
      </NFormItem>
      <NFormItem show-require-mark label="密码">
        <NInput v-model:value="password" type="password" placeholder="密码" />
      </NFormItem>
    </NForm>
    <template #action>
      <NuxtLink to="/auth/register" class="float-left">
        <NButton secondary> 去注册 </NButton>
      </NuxtLink>
      <NButton secondary type="primary" @click="login" class="float-right">
        登录
      </NButton>
    </template>
  </NCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

import { AxiosError } from "axios";

const account = ref();
const password = ref();

const message = useMessage();
const router = useRouter();

const login = async () => {
  if (!account.value || !password.value) {
    message.warning("缺少参数, 请补全参数再提交");
    return;
  }
  try {
    let loginResult = await LavaAnimeAPI.post("/v2/user/login", {
      account: account.value,
      password: password.value,
    });
    if (loginResult.data.code == 200) {
      message.success(loginResult.data.message);
      let token = loginResult.data.data.token;
      localStorage.setItem("token", JSON.stringify(token));
      router.push({ path: "/user" });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        message.error(error.response?.data?.message);
      } else if (error.message) {
        message.error("无法发送网络请求: " + error.message);
      }
    } else {
      message.error("发生意外错误");
    }
  }
};
</script>
