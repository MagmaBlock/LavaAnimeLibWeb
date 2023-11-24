<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="settings.darkMode.enable ? darkTheme : null"
    :theme-overrides="themeOverrides"
  >
    <slot></slot>
  </NConfigProvider>
</template>

<script setup>
import { darkTheme, dateZhCN, zhCN } from "naive-ui";
import { usePreferredDark } from "@vueuse/core";

const settings = useSettingsStore();

// 用户移动的系统深色模式设置
const isDark = usePreferredDark();
// 当系统深色模式变化时尝试应用深色模式
watch(isDark, () => settings.applySystemDark(isDark.value), {
  immediate: true,
});
// 启动时尝试根据时间应用深色模式
settings.applyTimeDark();

useHead({
  htmlAttrs: {
    class: () => (settings.darkMode.enable ? "dark" : ""),
  },
});

// 覆盖默认主题配置
const themeOverrides = {
  common: {
    primaryColor: "#2080F0FF",
    primaryColorHover: "#4098FCFF",
    primaryColorPressed: "#1060C9FF",
    primaryColorSuppl: "#4098FCFF",
    borderRadius: "4px",
  },
};
</script>
