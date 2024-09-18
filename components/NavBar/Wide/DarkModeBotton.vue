<template>
  <NavBarWideIcon
    :name="settings.darkMode.enable ? '深色模式' : '浅色模式'"
    @click="switchDarkMode"
  >
    <template #icon>
      <Icon
        :name="
          settings.darkMode.enable
            ? 'material-symbols:dark-mode'
            : 'material-symbols:light-mode'
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
