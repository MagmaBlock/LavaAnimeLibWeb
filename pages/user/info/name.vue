<template>
  <div>
    <NH2>修改用户名</NH2>
    当前用户名： {{ currentUsername ?? "(尚未登陆或获取失败)" }}
    <NH3>新用户名</NH3>
    <NInputGroup>
      <NInput
        v-model:value="newName"
        type="text"
        placeholder="新用户名，1-30个字"
      />
      <NButton type="primary" secondary @click="updateUserName"> 更改 </NButton>
    </NInputGroup>
    <NAlert title="提示" type="info" class="mt-4">
      当您修改了用户名后, 您登录也需要使用新的用户名。<br />
      或者您也可以使用当前账户的邮箱进行登录：{{
        userEmail ?? "(尚未登陆或获取失败)"
      }}
    </NAlert>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "user-info",
});

useHead({ title: "修改用户名" });

const { $client } = useNuxtApp();
const message = useMessage();

const currentUsername = ref("");
const userEmail = ref("");
const newName = ref("");

onMounted(async () => {
  try {
    const result = await $client.pages.userInfo.getChangeNameMeta.query();
    currentUsername.value = result.username;
    userEmail.value = result.email;
  } catch (error) {
    message.error("获取当前用户信息失败");
  }
});

async function updateUserName() {
  if (!newName.value) return message.warning("请输入新用户名");
  try {
    const result = await $client.pages.userInfo.updateUsername.mutate({
      newName: newName.value,
    });
    message.success(result.message);
    currentUsername.value = result.data.name;
    newName.value = "";
  } catch (error) {
    console.error(error);
    message.error("更新用户名失败");
  }
}
</script>
