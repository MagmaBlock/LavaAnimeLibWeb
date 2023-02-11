<template>
  <n-space v-if="userInfo?.data?.permission?.admin || $route.name.startsWith('Admin')">
    <template v-for="tab in tabs">
      <RouterLink :to="{ name: tab.routeName }">
        <n-button strong secondary>
          {{ tab.name }}
        </n-button>
      </RouterLink>
    </template>
  </n-space>
</template>

<script setup>
import { userInfo } from '../../common/API/user.js';

const tabs = [
  { name: '主页头图', routeName: 'AdminHeader' },
  { name: '邀请码管理', routeName: 'AdminInvite' }
]
</script>