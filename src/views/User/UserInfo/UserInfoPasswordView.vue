<template>
  <div>
    <n-h2>修改密码</n-h2>
    <n-alert class="my-4" title="提示" type="info">
      请记住您的新密码 {{ newPassword }}, 目前番剧库忘记密码只能人工...
    </n-alert>
    <n-input-group>
      <n-input v-model:value="newPassword" :input-props="{ type: 'password' }"
               placeholder="新密码. 至少包含字母, 且长度为7-64"/>
      <n-button secondary type="primary" @click="changePassword">
        更改
      </n-button>
    </n-input-group>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {LavaAnimeAPI} from '@/common/api';

const newPassword = ref('')

async function changePassword() {
  try {
    let query = await LavaAnimeAPI.post('/v2/user/changepassword', {
      password: newPassword.value
    })
    if (query.data.code == 200) {
      $message.success(query.data.message)
    }
  } catch (error) {
    console.error(error);
  }
}
</script>