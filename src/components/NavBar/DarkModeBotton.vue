<template>
  <div class="text-xl grid place-items-center w-12 h-12 cursor-pointer
  text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200
  lg:hover:bg-slate-200 lg:dark:hover:bg-zinc-700 rounded-md transition" @click="switchDarkMode">
    <i class="bi bi-moon-stars" v-if="darkMode"></i>
    <i class="bi bi-sun" v-else></i>
  </div>
</template>

<script>
import settings from '../../common/Methods/settings';

export default {
  computed: {
    darkMode() {
      return settings.darkMode.on
    }
  },
  methods: {
    switchDarkMode() {
      settings.darkMode.on = !settings.darkMode.on
    }
  }
}
</script>