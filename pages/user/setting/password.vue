<template>
  <div>
    <NH2>修改密码</NH2>
    <NAlert title="提示" type="info" class="my-4">
      请记住您的新密码 <NText code v-if="newPassword">{{ newPassword }}</NText
      >, 目前番剧库忘记密码只能人工...
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

useHead({ title: "修改密码" });

const { $client } = useNuxtApp();
const newPassword = ref("");
const message = useMessage();

async function changePassword() {
  if (!newPassword.value) return message.warning("请输入新密码");
  try {
    const result = await $client.pages.userInfo.updatePassword.mutate({
      newPassword: newPassword.value,
    });
    message.success(result.message);
    newPassword.value = "";
  } catch (error) {
    console.error(error);
    message.error("更新密码失败");
  }
}
</script>
