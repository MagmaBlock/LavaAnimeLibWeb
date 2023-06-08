<template>
  <div
    class="text-xl grid place-items-center w-12 h-12 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-zinc-200 lg:hover:bg-zinc-200 lg:dark:hover:bg-zinc-700 rounded-md transition"
    @click="switchDarkMode"
  >
    <i class="bi bi-moon-stars" v-if="settings.darkMode.on"></i>
    <i class="bi bi-sun" v-else></i>
  </div>
</template>

<script setup>
import { useSettingsStore } from "../../store/Settings";

const settings = useSettingsStore();

function switchDarkMode() {
  settings.darkMode.on = !settings.darkMode.on;
}
</script>
