<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="settings.darkMode.enable ? darkTheme : null"
    :theme-overrides="overrides"
  >
    <slot></slot>
  </NConfigProvider>
</template>

<script setup>
import { darkTheme, dateZhCN, zhCN } from "naive-ui";
import { usePreferredDark } from "@vueuse/core";

const settings = useSettingsStore();

// 用户的系统深色模式设置
const isDark = usePreferredDark();
// 当系统深色模式变化时 改变深色模式的相关响应式
watch(isDark, () => settings.applySystemDark(isDark.value), {
  immediate: true,
});
// 启动时尝试根据时间应用深色模式
settings.applyTimeDark();

// TailwindCSS 的深色应用
useHead({
  htmlAttrs: {
    class: () => (settings.darkMode.enable ? "dark" : ""),
  },
});

// NaiveUI 主题自定义
const themeOverrides = {
  common: {
    primaryColor: "#2080F0FF",
    primaryColorHover: "#4098FCFF",
    primaryColorPressed: "#1060C9FF",
    primaryColorSuppl: "#4098FCFF",
    borderRadius: "4px",
  },
};

const darkThemeOverrides = {
  common: {
    popoverColor: "rgba(39, 39, 42, 1)",
    modalColor: "rgba(24, 24, 28, 1)",
  },
};

/**
 * 根据深色模式计算应该使用的样式覆盖
 */
const overrides = computed(() => {
  if (settings.darkMode.enable) {
    return mergeThemes(darkThemeOverrides, themeOverrides);
  } else {
    return themeOverrides;
  }
});

/**
 * 深层合并两个对象
 * @author ChatGPT
 * @param {...Object} themes NaiveUIThemeOverrides
 */
function mergeThemes(...themes) {
  const mergedTheme = {};

  themes.forEach((theme) => {
    Object.keys(theme).forEach((key) => {
      if (!mergedTheme[key]) {
        mergedTheme[key] = theme[key];
      } else {
        if (
          typeof mergedTheme[key] === "object" &&
          typeof theme[key] === "object"
        ) {
          mergedTheme[key] = { ...mergedTheme[key], ...theme[key] };
        } else {
          mergedTheme[key] = theme[key];
        }
      }
    });
  });

  return mergedTheme;
}
</script>
