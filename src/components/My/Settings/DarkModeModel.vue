<template>
  <!-- 深色模式弹窗设置 -->
  <n-modal v-model:show="show" class="select-none">
    <n-card :bordered="false" aria-modal="true" class="max-w-xl" role="dialog" size="small" title="深色模式设置">
      <template #header-extra>
        <i class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2" @click="show = false"></i>
      </template>
      <n-list clickable hoverable>
        <n-list-item @click="settings.darkMode.on = !settings.darkMode.on">
          深色模式
          <n-switch :value="settings.darkMode.on" class="float-right"/>
        </n-list-item>
        <n-list-item @click="settings.darkMode.autoDarkMode = !settings.darkMode.autoDarkMode">
          自动启用深色模式
          <n-switch :value="settings.darkMode.autoDarkMode" class="float-right"/>
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
        <n-collapse-transition :show="settings.darkMode.autoMode == 'system'">
          <div class="px-5 pb-2 text-xs text-gray-400">
            若您正在使用部分<strong>手机</strong>国产浏览器，<strong>此功能可能无法使用</strong>。<br>
            手机端目前确定支持: Chrome、Edge、FireFox、Via、X浏览器、Safari。<br>
            夸克、360、QQ浏览器等已确定无法支持。
          </div>
        </n-collapse-transition>
        <!-- 跟随的时间设置面版 -->
        <n-collapse-transition :show="settings.darkMode.autoMode == 'time'">
          <div class="px-5 py-3">
            <n-space vertical>
              <!-- <n-slider v-model:value="settings.darkMode.now" :step="1" :min="0" :max="23" /> -->
              <div>
                深色开始时间 / 晚上 (24小时制)
                <n-slider v-model:value="settings.darkMode.darkTime" :max="23" :min="0" :step="1"/>
              </div>
              <div>
                浅色开始时间 / 早晨 (24小时制)
                <n-slider v-model:value="settings.darkMode.lightTime" :max="23" :min="0" :step="1"/>
              </div>
              <n-space>
                <n-input-number v-model:value="settings.darkMode.darkTime" size="small"/>
                <n-input-number v-model:value="settings.darkMode.lightTime" size="small"/>
              </n-space>
            </n-space>
          </div>
        </n-collapse-transition>
      </n-collapse-transition>
    </n-card>
  </n-modal>
</template>


<script>
import settings from '../../../common/Methods/settings';

export default {
  data() {
    return {
      settings: settings,
      show: false
    }
  }
}
</script>