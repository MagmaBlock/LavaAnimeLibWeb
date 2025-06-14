<template>
  <NCard>
    <NH2> 注册新账户 </NH2>
    <NForm @keyup.enter="register">
      <NFormItem show-require-mark label="邮箱">
        <NInput v-model:value="email" type="text" placeholder="邮箱" />
      </NFormItem>
      <NFormItem show-require-mark label="用户名">
        <NInput v-model:value="name" type="text" placeholder="用户名" />
      </NFormItem>
      <NFormItem show-require-mark label="密码">
        <NInput v-model:value="password" type="password" placeholder="密码" />
      </NFormItem>
      <NFormItem show-require-mark label="邀请码">
        <NInput
          v-model:value="inviteCode"
          type="text"
          placeholder="邀请码 (必填)"
        />
      </NFormItem>
    </NForm>
    <template #action>
      <NuxtLink to="/auth/login" class="float-left">
        <NButton secondary> 去登录 </NButton>
      </NuxtLink>
      <NButton secondary type="primary" @click="register" class="float-right">
        注册
      </NButton>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { TRPCClientError } from "@trpc/client";

definePageMeta({
  layout: "auth",
});

useHead({ title: "注册" });

const email = ref("");
const password = ref("");
const name = ref("");
const inviteCode = ref("");

const message = useMessage();
const router = useRouter();
const { $client } = useNuxtApp();

const register = async () => {
  if (!email.value || !password.value || !name.value || !inviteCode.value) {
    message.warning("请填写所有必填项");
    return;
  }

  try {
    const { message: resultMessage, data } =
      await $client.pages.auth.register.mutate({
        email: email.value,
        name: name.value,
        password: password.value,
        inviteCode: inviteCode.value,
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
