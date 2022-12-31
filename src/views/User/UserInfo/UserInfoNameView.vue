<template>
  <div>
    <n-h2>修改用户名</n-h2>
    当前用户名： {{ userInfo.name ?? '(尚未登陆或获取失败)' }}
    <n-h3>新用户名</n-h3>
    <n-input-group>
      <n-input v-model:value="newName" type="text" placeholder="新用户名，1-30个字" />
      <n-button type="primary" secondary @click="updateUserName(newName)">
        更改
      </n-button>
    </n-input-group>
    <n-alert title="提示" type="info" class="mt-4">
      当您修改了用户名后, 您登录也需要使用新的用户名。<br>
      或者您也可以使用当前账户的邮箱进行登录：{{ userInfo.email ?? '(尚未登陆或获取失败)' }}
    </n-alert>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LavaAnimeAPI } from '../../../common/api';
import { userInfo, getUserInfo } from '../../../common/API/user';

getUserInfo()
const newName = ref('')

async function updateUserName(newName) {
  if (!newName) return $message.warning('请输入新用户名')
  try {
    let updateRequest = await LavaAnimeAPI.post('/v2/user/info/name', { name: newName })
    if (updateRequest.data.code == 200) {
      $message.success(updateRequest.data.message)
      getUserInfo()
    }
  } catch (error) {
    console.error(error);
    $message.error(error)
  }
}

</script>