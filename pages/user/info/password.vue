<template>
  <div>
    <NH2>修改密码</NH2>
    <NAlert title="提示" type="info" class="my-4">
      请记住您的新密码 {{ newPassword }}, 目前番剧库忘记密码只能人工...
    </NAlert>
    <NInputGroup>
      <NInput
        v-model:value="newPassword"
        :input-props="{ type: 'password' }"
        placeholder="新密码. 至少包含字母, 且长度为7-64"
      />
      <NButton type="primary" secondary @click="changePassword"> 更改 </NButton>
    </NInputGroup>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "user-info",
});

const newPassword = ref("");

const message = useMessage();

async function changePassword() {
  try {
    let query = await LavaAnimeAPI.post("/v2/user/changepassword", {
      password: newPassword.value,
    });
    if (query.data.code == 200) {
      message.success(query.data.message);
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
