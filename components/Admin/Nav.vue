<template>
  <component
    :is="withCard ? NCard : 'div'"
    title="管理员后台"
    :bordered="false"
    embedded
    v-if="
      userStore.userInfo?.data?.permission?.admin ||
      route.name.startsWith('admin')
    "
  >
    <NSpace>
      <template v-for="tab in tabs">
        <RouterLink :to="{ name: tab.routeName }">
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
  { name: "主页头图", routeName: "admin-header" },
  { name: "邀请码管理", routeName: "admin-invite" },
  { name: "索引页活动", routeName: "admin-index-activity" },
];
</script>
