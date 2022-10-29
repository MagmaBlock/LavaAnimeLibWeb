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
    this.updateDarkMode()
  },
  watch: {
    'settings.darkMode.on': function () {
      this.updateTailWindDark()
    },
    'settings.darkMode.now': function () { // Debug
      this.updateDarkMode()
    }
  },
  methods: {
    // 如果开关改变, 则调整 body 的 dark class
    updateTailWindDark() {
      if (settings.darkMode.on) {
        document.body.classList.add('dark')
        document.body.classList.add('bg-black')
      }
      else {
        document.body.classList.remove('dark')
        document.body.classList.remove('bg-black')
      }
    },
    // 根据当前的时间和自动开关, 调整深色模式
    updateDarkMode() {
      if (settings.darkMode.autoDarkMode == false) return // 如果没有开启自动深色，什么也不做
      if (settings.darkMode.autoMode == 'system') {
        // 增加事件监听
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
          if (settings.darkMode.autoDarkMode == false) return // 如果没有开启自动深色，什么也不做
          // is dark mode
          if (event.matches) {
            settings.darkMode.on = false
          } else {
            // not dark mode
            settings.darkMode.on = true
          }
        })
        // 浅色
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          settings.darkMode.on = false
        }
        // 深色
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          settings.darkMode.on = true
        }
      }
      if (settings.darkMode.autoMode == 'time') {
        let now = new Date().getHours()
        let dark = settings.darkMode.darkTime
        let light = settings.darkMode.lightTime


        if (dark >= light) { // 如果深色开始时间晚于浅色开始时间 (夜晚深色，白天浅色，正常情况)
          if (light < now <= dark) {
            console.log('light < now <= dark');
            settings.darkMode.on = false
          }
          if (dark <= now || now < light) {
            console.log('dark <= now || now < light');
            settings.darkMode.on = true
          }
        }

        if (dark < light) { // 如果深色开始时间早于浅色开始时间 (夜晚浅色，白天深色，吸血鬼)
          if (dark < now <= light) {
            console.log('dark < now <= light');
            settings.darkMode.on = true
          }
          if (light <= now || now < dark) {
            console.log('light <= now || now < dark');
            settings.darkMode.on = false
          }
        }


      }
    }
  }
}
</script>