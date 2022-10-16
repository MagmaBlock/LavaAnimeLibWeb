import { reactive, watch } from "vue"

let defaultSetting = {
  darkMode: {
    on: false,
    autoDarkMode: true,
  }
}

let userSettings = localStorage.getItem('settings')

let settings = reactive({
  ...defaultSetting, ...JSON.parse(userSettings)
})

function saveSettings() {
  localStorage.setItem('settings', JSON.stringify(settings))
}

watch(settings, (a, b) => {
  console.log(a, b);
  saveSettings()
})

export default settings