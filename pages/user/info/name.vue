<template>
  <div>
    <NH2>修改用户名</NH2>
    当前用户名： {{ userStore.userInfo.name ?? "(尚未登陆或获取失败)" }}
    <NH3>新用户名</NH3>
    <NInputGroup>
      <NInput
        v-model:value="newName"
        type="text"
        placeholder="新用户名，1-30个字"
      />
      <NButton type="primary" secondary @click="updateUserName(newName)">
        更改
      </NButton>
    </NInputGroup>
    <NAlert title="提示" type="info" class="mt-4">
      当您修改了用户名后, 您登录也需要使用新的用户名。<br />
      或者您也可以使用当前账户的邮箱进行登录：{{
        userStore.userInfo.email ?? "(尚未登陆或获取失败)"
      }}
    </NAlert>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "user-info",
});

useHead({ title: "修改用户名" });

const userStore = useUserStore();
userStore.getUserInfo();

const newName = ref("");

const message = useMessage();

async function updateUserName(newName) {
  if (!newName) return message.warning("请输入新用户名");
  try {
    let updateRequest = await LavaAnimeAPI.post("/v2/user/info/name", {
      name: newName,
    });
    if (updateRequest.data.code == 200) {
      message.success(updateRequest.data.message);
      userStore.getUserInfo();
    }
  } catch (error) {
    console.error(error);
    message.error(error);
  }
}
</script>
