<template>
  <div
    class="grid place-items-center w-12 h-12 cursor-pointer text-gray-500 dark:text-gray-400 lg:hover:bg-zinc-200 lg:dark:hover:bg-zinc-800 active:scale-95 rounded-md transition-transform"
    @click="switchDarkMode"
  >
    <Icon
      name="fluent:weather-moon-24-regular"
      v-if="settings.darkMode.enable"
      size="24"
    />
    <Icon name="fluent:weather-sunny-24-regular" v-else size="24" />
  </div>
</template>

<script setup>
const settings = useSettingsStore();

function switchDarkMode() {
  settings.darkMode.enable = !settings.darkMode.enable;
}
</script>
