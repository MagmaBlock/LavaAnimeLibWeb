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
    label: "番剧",
    key: "/admin/anime",
    icon: renderIcon("material-symbols:movie"),
    children: [
      {
        label: "管理",
        key: "/admin/anime/manage",
        icon: renderIcon("material-symbols:list-alt"),
      },
    ],
  },
  {
    label: "存储",
    key: "/admin/storage",
    icon: renderIcon("material-symbols:storage"),
    children: [
      {
        label: "存储器",
        key: "/admin/storage/manage",
        icon: renderIcon("material-symbols:settings"),
      },
      {
        label: "文件索引",
        key: "/admin/storage/file-index",
        icon: renderIcon("material-symbols:folder"),
      },
      {
        label: "挂削",
        key: "/admin/storage/scrape",
        icon: renderIcon("material-symbols:download"),
      },
    ],
  },
  {
    label: "邀请码",
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
