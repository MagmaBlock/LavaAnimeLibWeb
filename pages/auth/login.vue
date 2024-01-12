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
    let loginResult = await LavaAnimeAPI.post("/auth/login", {
      account: account.value,
      password: password.value,
    });
    message.success("登录成功, 欢迎回来, " + loginResult.data?.user?.name);
    localStorage.setItem("token", JSON.stringify(loginResult.data.token));
    router.push({ path: "/user" });
  } catch (error) {}
};
</script>
