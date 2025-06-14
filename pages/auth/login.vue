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
import { TRPCClientError } from "@trpc/client";

definePageMeta({ layout: "auth" });
useHead({ title: "登录" });

const account = ref("");
const password = ref("");
const message = useMessage();
const router = useRouter();
const { $client } = useNuxtApp();

const login = async () => {
  if (!account.value || !password.value) {
    message.warning("请输入邮箱 / 用户名和密码");
    return;
  }

  try {
    const { message: resultMessage, data } =
      await $client.pages.auth.login.mutate({
        account: account.value,
        password: password.value,
      });
    message.success(resultMessage);

    localStorage.setItem("token", data.token);
    router.push("/user");
  } catch (error) {
    console.error(error);
    message.error(
      error instanceof TRPCClientError ? error.message : "发生意外错误",
    );
  }
};
</script>
