<template>
  <NavBarWideIcon
    :name="settings.darkMode.enable ? '深色模式' : '浅色模式'"
    @click="switchDarkMode"
  >
    <template #icon>
      <Icon
        :name="
          settings.darkMode.enable
            ? 'fluent:weather-moon-24-regular'
            : 'fluent:weather-sunny-24-regular'
        "
      />
    </template>
  </NavBarWideIcon>
</template>

<script setup>
const settings = useSettingsStore();

function switchDarkMode() {
  settings.darkMode.enable = !settings.darkMode.enable;
}
</script>
