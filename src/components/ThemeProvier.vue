<template>
  <n-config-provider :theme="settings.darkMode.on ? darkTheme : null" :theme-overrides="themeOverrides">
    <slot></slot>
  </n-config-provider>
</template>

<script>
import { darkTheme } from 'naive-ui'
import settings from './Methods/settings.js'

export default {
  data() {
    return {
      settings: settings,
      darkTheme: darkTheme,
      themeOverrides: { // 覆盖默认主题配置
        "common": {
          "primaryColor": "#2080F0FF",
          "primaryColorHover": "#4098FCFF",
          "primaryColorPressed": "#1060C9FF",
          "primaryColorSuppl": "#4098FCFF"
        }
      }
    }
  },
  mounted() {
    this.updateTailWindDark()
  },
  watch: {
    'settings.darkMode.on': function () {
      this.updateTailWindDark()
      console.log(this);
    }
  },
  methods: {
    updateTailWindDark() {
      if (settings.darkMode.on) {
        document.body.classList.add('dark')
      }
      else {
        document.body.classList.remove('dark')
      }
    }
  }
}
</script>