<template>
  <!-- 深色模式弹窗设置 -->
  <NModal
    :show="show"
    @update:show="$emit('update:show', false)"
    class="select-none"
  >
    <NCard
      class="max-w-xl"
      title="深色模式设置"
      :bordered="false"
      size="small"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <i
          class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2"
          @click="$emit('update:show', false)"
        ></i>
      </template>
      <NList hoverable clickable>
        <NListItem
          @click="settings.darkMode.enable = !settings.darkMode.enable"
        >
          深色模式
          <NSwitch :value="settings.darkMode.enable" class="float-right" />
        </NListItem>
        <NListItem
          @click="
            settings.darkMode.autoDarkMode = !settings.darkMode.autoDarkMode
          "
        >
          自动启用深色模式
          <NSwitch
            :value="settings.darkMode.autoDarkMode"
            class="float-right"
          />
        </NListItem>
      </NList>
      <NCollapseTransition :show="settings.darkMode.autoDarkMode">
        <NSpace class="px-5 py-3">
          <NRadio
            :checked="settings.darkMode.autoMode == 'system'"
            @click="settings.darkMode.autoMode = 'system'"
          >
            跟随系统设定
          </NRadio>
          <NRadio
            :checked="settings.darkMode.autoMode == 'time'"
            @click="settings.darkMode.autoMode = 'time'"
          >
            根据时间
          </NRadio>
        </NSpace>
        <NCollapseTransition :show="settings.darkMode.autoMode == 'system'">
          <div class="px-5 pb-2 text-xs text-gray-400">
            需要浏览器支持，番剧库才能获取到您系统的深色模式设定。<br />
            桌面端大部分浏览器均已支持此功能。<br />
            手机端 Chrome、Edge、FireFox、Via、X浏览器、Safari、360极速浏览器等支持此功能。<br />
            部分手机浏览器可能将深色模式适配与夜间模式合并，需要打开夜间模式。
          </div>
        </NCollapseTransition>
        <!-- 跟随的时间设置面版 -->
        <NCollapseTransition :show="settings.darkMode.autoMode == 'time'">
          <div class="px-5 py-3">
            <NSpace vertical>
              <!-- <n-slider v-model:value="settings.darkMode.now" :step="1" :min="0" :max="23" /> -->
              <div>
                深色开始时间 / 晚上 (24小时制)
                <NSlider
                  v-model:value="settings.darkMode.darkTime"
                  :step="1"
                  :min="0"
                  :max="23"
                />
              </div>
              <div>
                浅色开始时间 / 早晨 (24小时制)
                <NSlider
                  v-model:value="settings.darkMode.lightTime"
                  :step="1"
                  :min="0"
                  :max="23"
                />
              </div>
              <NSpace>
                <NInputNumber
                  v-model:value="settings.darkMode.darkTime"
                  size="small"
                />
                <NInputNumber
                  v-model:value="settings.darkMode.lightTime"
                  size="small"
                />
              </NSpace>
            </NSpace>
          </div>
        </NCollapseTransition>
      </NCollapseTransition>
    </NCard>
  </NModal>
</template>

<script setup>
const settings = useSettingsStore();
defineProps({
  show: Boolean,
});
defineEmits(["update:show"]);
</script>
