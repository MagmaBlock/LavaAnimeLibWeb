<template>
  <component
    :is="withCard ? NCard : 'div'"
    title="管理员后台"
    :bordered="false"
    embedded
    v-if="
      userStore.userInfo?.data?.permission?.admin ||
      route.name.startsWith('Admin')
    "
  >
    <NSpace>
      <template v-for="tab in tabs">
        <RouterLink :to="{ path: tab.routeName }">
          <NButton strong secondary>
            {{ tab.name }}
          </NButton>
        </RouterLink>
      </template>
    </NSpace>
  </component>
</template>

<script setup>
import { NCard } from "naive-ui";

const route = useRoute();
const userStore = useUserStore();

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
