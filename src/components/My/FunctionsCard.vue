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
          <n-list hoverable clickable>
            <n-list-item @click="settings.darkMode.on = !settings.darkMode.on">
              深色模式
              <n-switch :value="settings.darkMode.on" class="float-right" />
            </n-list-item>
            <n-list-item @click="settings.darkMode.autoDarkMode = !settings.darkMode.autoDarkMode">
              自动启用深色模式
              <n-switch :value="settings.darkMode.autoDarkMode" class="float-right" />
            </n-list-item>
          </n-list>
          <n-collapse-transition :show="settings.darkMode.autoDarkMode">
            <n-space class="px-5 py-3">
              <n-radio :checked="settings.darkMode.autoMode == 'system'" @click="settings.darkMode.autoMode = 'system'">
                跟随系统设定
              </n-radio>
              <n-radio :checked="settings.darkMode.autoMode == 'time'" @click="settings.darkMode.autoMode = 'time'">
                根据时间
              </n-radio>
            </n-space>
            <!-- 跟随的时间设置面版 -->
            <n-collapse-transition :show="settings.darkMode.autoMode == 'time'">
              <div class="px-5 py-3">
                <n-space vertical>
                  <!-- <n-slider v-model:value="settings.darkMode.now" :step="1" :min="0" :max="23" /> -->
                  <div>
                    深色开始时间 / 晚上 (24小时制)
                    <n-slider v-model:value="settings.darkMode.darkTime" :step="1" :min="0" :max="23" />
                  </div>
                  <div>
                    浅色开始时间 / 早晨 (24小时制)
                    <n-slider v-model:value="settings.darkMode.lightTime" :step="1" :min="0" :max="23" />
                  </div>
                  <n-space>
                    <n-input-number v-model:value="settings.darkMode.darkTime" size="small" />
                    <n-input-number v-model:value="settings.darkMode.lightTime" size="small" />
                  </n-space>
                </n-space>
              </div>
            </n-collapse-transition>
          </n-collapse-transition>
        </n-card>
      </n-modal>
    </div>
  </BasicCard>
</template>

<script>
import { ref } from 'vue';
import settings from '../Methods/settings.js';

export default {
  data() {
    return {
      darkModeModel: ref(false),
      settings: settings
    }
  },
  methods: {

  }
}
</script>