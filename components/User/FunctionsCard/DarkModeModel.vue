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
            若您正在使用部分<strong>手机</strong>国产浏览器，<strong>此功能可能无法使用</strong>。<br />
            手机端目前确定支持: Chrome、Edge、FireFox、Via、X浏览器、Safari。<br />
            夸克、360、QQ浏览器等已确定无法支持。
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
