<template>
  <NCard>
    <NH2> 注册新账户 </NH2>
    <NForm>
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
definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
const name = ref("");
const inviteCode = ref("");

const message = useMessage();
const router = useRouter();

const register = async () => {
  try {
    if (!email.value || !password.value || !name.value || !inviteCode.value) {
      message.warning("缺少参数, 请补全参数再提交");
      return;
    }

    const regResult = await LavaAnimeAPI.post("/auth/register", {
      email: email.value,
      password: password.value,
      name: name.value,
      inviteCode: inviteCode.value,
    });
    message.success("注册成功");
    console.log(regResult);

    // // 开始尝试登录
    // let loginResult = await LavaAnimeAPI.post("/v2/user/login", {
    //   account: email.value,
    //   password: password.value,
    // });
    // if (loginResult.data.code == 200) {
    //   // 成功登录
    //   message.success(loginResult.data.message);
    //   let token = loginResult.data.data.token;
    //   localStorage.setItem("token", JSON.stringify(token));
    //   router.push({ path: "/user" });
    // } else {
    //   // 注册成功但是登录失败？
    //   router.push({ path: "/login" });
    //   message.error("注册成功但是登录失败？不管了，先把你传送到登录页");
    // }
  } catch (error) {}
};
</script>
