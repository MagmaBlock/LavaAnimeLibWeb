<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="settings.darkMode.on ? darkTheme : null"
    :theme-overrides="themeOverrides"
    :class="settings.darkMode.on ? 'dark bg-black' : ''"
  >
    <slot></slot>
  </n-config-provider>
</template>

<script setup>
import { darkTheme, dateZhCN, zhCN } from "naive-ui";
import { useSettingsStore } from "../store/Settings.js";
import { usePreferredDark } from "@vueuse/core";
import { watch } from "vue";

const settings = useSettingsStore();

// 用户的系统深色模式设置
const isDark = usePreferredDark();
// 监听系统深色模式变化
watch(isDark, () => settings.applySystemDark(isDark.value), {
  immediate: true,
});

settings.applyTimeDark();

// 覆盖默认主题配置
const themeOverrides = {
  common: {
    primaryColor: "#2080F0FF",
    primaryColorHover: "#4098FCFF",
    primaryColorPressed: "#1060C9FF",
    primaryColorSuppl: "#4098FCFF",
  },
};
</script>
