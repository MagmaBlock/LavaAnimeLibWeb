<template>
  <component
    :is="withCard ? NCard : 'div'"
    title="管理员后台"
    :bordered="false"
    embedded
    v-if="
      userInfo?.data?.permission?.admin || useRoute().name.startsWith('Admin')
    "
  >
    <n-space>
      <template v-for="tab in tabs">
        <RouterLink :to="{ name: tab.routeName }">
          <n-button strong secondary>
            {{ tab.name }}
          </n-button>
        </RouterLink>
      </template>
    </n-space>
  </component>
</template>

<script setup>
import { userInfo } from "../../common/API/user.js";
import { useRoute } from "vue-router";
import { NCard } from "naive-ui";

defineProps({
  withCard: {
    type: Boolean,
    default: false,
  },
});

const tabs = [
  { name: "主页头图", routeName: "AdminHeader" },
  { name: "邀请码管理", routeName: "AdminInvite" },
  { name: "索引页活动", routeName: "AdminIndexActivity" },
];
</script>
