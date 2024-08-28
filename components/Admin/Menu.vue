<template>
  <NMenu
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuClick"
    :mode="mode"
    responsive
  />
</template>

<script lang="ts" setup>
import { Icon } from "#components";
import { NIcon } from "naive-ui";
import type { MenuOption } from "naive-ui";

defineProps<{
  mode?: "vertical" | "horizontal";
}>();

const route = useRoute();
const router = useRouter();

function renderIcon(icon?: string | null) {
  if (!icon) return () => h("div");
  return () => h(NIcon, null, { default: () => h(Icon, { name: icon }) });
}

const menuOptions: MenuOption[] = [
  {
    label: "主页",
    key: "/admin",
    icon: renderIcon("material-symbols:home"),
  },
  {
    label: "邀请码管理",
    key: "/admin/invite-code",
    icon: renderIcon("material-symbols:bookmark"),
  },
];

const activeKey = computed(() => route.path);

const handleMenuClick = (key: string) => {
  router.push(key);
};
</script>

<style></style>
