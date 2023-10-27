<template>
  <div
    class="text-xl grid place-items-center w-12 h-12 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-zinc-200 lg:hover:bg-zinc-200 lg:dark:hover:bg-zinc-800 rounded transition"
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
