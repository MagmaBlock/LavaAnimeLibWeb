<template>
  <BasicCard class="px-6 py-4 rounded-md mb-4 select-none">
    <div class="text-xl mb-2">其他功能</div>
    <!-- Contents -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <!-- 帮助 -->
      <div class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md grid grid-cols-1">
        <RouterLink to="/help" class="p-8">
          <div class="text-gray-700 dark:text-zinc-100 w-full text-4xl mb-2 text-center">
            <i class="bi bi-book-half"></i>
          </div>
          <div class="text-gray-700 dark:text-zinc-100 w-full text-center">
            番剧库使用帮助
          </div>
        </RouterLink>
      </div>
      <!-- 深色模式 -->
      <div class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md grid grid-cols-1">
        <div class="p-8" @click="darkModeModel = true">
          <div class="text-gray-700 dark:text-zinc-100 w-full text-4xl mb-2 text-center">
            <i class="bi bi-moon-fill"></i>
          </div>
          <div class="text-gray-700 dark:text-zinc-100 w-full text-center">
            深色模式
          </div>
        </div>
      </div>
      <!-- 深色模式弹窗设置 -->
      <n-modal v-model:show="darkModeModel" class="select-none">
        <n-card class="max-w-xl" title="深色模式设置" :bordered="false" size="small" role="dialog" aria-modal="true">
          <template #header-extra>
            <i class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2" @click="darkModeModel = false"></i>
          </template>
          暂未完成...
          <n-list hoverable clickable>
            <n-list-item @click="switchDarkMode">
              深色模式
              <n-switch :value="settings.darkMode" class="float-right" />
            </n-list-item>
            <n-list-item @click="switchAutoDarkMode">
              自动启用深色模式
              <n-switch :value="settings.autoDarkMode" class="float-right" />
            </n-list-item>
          </n-list>
        </n-card>
      </n-modal>
    </div>
  </BasicCard>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      darkModeModel: ref(false),
      settings: {
        darkMode: false,
        autoDarkMode: false,
      }
    }
  },
  methods: {
    switchDarkMode() {
      this.settings.darkMode = !this.settings.darkMode
      this.saveSettings()
    },
    switchAutoDarkMode() {
      this.settings.autoDarkMode = !this.settings.autoDarkMode
      this.saveSettings()
    },
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify(this.settings))
    }
  },
  mounted() {
    let settings = localStorage.getItem('settings')
    if (!settings) return
    settings = JSON.parse(settings)
    this.settings = settings
  }
}
</script>