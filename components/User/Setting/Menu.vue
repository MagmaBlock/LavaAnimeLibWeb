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
    label: "修改头像",
    key: "/user/setting/avatar",
    icon: renderIcon("material-symbols:image"),
  },
  {
    label: "修改用户名",
    key: "/user/setting/name",
    icon: renderIcon("material-symbols:edit"),
  },
  {
    label: "修改密码",
    key: "/user/setting/password",
    icon: renderIcon("material-symbols:lock"),
  },
];

const activeKey = computed(() => route.path);

const handleMenuClick = (key: string) => {
  router.push(key);
};
</script>

<style></style>
