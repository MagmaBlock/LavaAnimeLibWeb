<template>
  <NCollapseTransition>
    <div class="flex items-center gap-2 flex-nowrap">
      <NSwitch v-model:value="animeStore.subtitleData.enabled" />
      <Icon name="material-symbols:subtitles-outline" class="w-6 h-6" />
      <NSelect
        :placeholder="
          animeStore.subtitleData.localSubtitle
            ? `本地字幕: ${getShortName(
                animeStore.subtitleData.localSubtitle.name
              )}`
            : '未选择外挂字幕'
        "
        size="small"
        :options="subtitleSelectList"
        :value="subtitleSelectCurrentValue"
        :dropdown-props="{ trigger: 'click', showArrow: true }"
        @update:value="handleSubtitleSelect"
        class="truncate"
      >
        <template #action>
          <div class="flex flex-col gap-2">
            <NPopover trigger="click">
              <template #trigger>
                <NButton size="small">
                  <template #icon>
                    <Icon name="material-symbols:help" class="w-5 h-5" />
                  </template>
                  这是什么
                </NButton>
              </template>
              <NAlert type="info">
                外挂字幕是一种将字幕和视频分离的技术，番剧库支持外挂字幕，您可以切换不同的字幕轨道，或者选择您设备上的字幕。<br />
                通常中文字幕以"zh"、"chi"来结尾。
              </NAlert>
            </NPopover>

            <NButton
              v-if="animeStore.subtitleData.localSubtitle"
              size="small"
              type
              @click="handleClearLocalSubtitle"
            >
              <template #icon>
                <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
              </template>
              清除本地字幕
            </NButton>

            <NButton
              v-if="!animeStore.subtitleData.localSubtitle"
              size="small"
              type="primary"
              @click="handleUploadSubtitle"
            >
              <template #icon>
                <Icon name="material-symbols:upload" class="w-5 h-5" />
              </template>
              播放本地字幕
            </NButton>
          </div>
        </template>
      </NSelect>
    </div>
  </NCollapseTransition>
</template>

<script lang="ts" setup>
const animeStore = useAnimeStore();
const message = useMessage();

// 获取截断的文件名显示
function getShortName(name: string) {
  return name.length > 20 ? `...${name.slice(-18)}` : name;
}

// 计算字幕选择列表
const subtitleSelectList = computed(() => {
  return animeStore.subtitleList.map((file) => {
    const displayName =
      file.name.length > 60 ? `...${file.name.slice(-30)}` : file.name;

    return {
      label: displayName,
      value: file.name,
    };
  });
});

// 当前选中的字幕值
const subtitleSelectCurrentValue = computed(() => {
  return animeStore.activeSubtitle?.name;
});

// 处理字幕选择
function handleSubtitleSelect(value: string) {
  handleClearLocalSubtitle();
  animeStore.subtitleData.subtitleFileName = value;
  animeStore.subtitleData.enabled = true;
}

// 处理本地字幕上传
function handleUploadSubtitle() {
  // 创建文件输入元素
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".srt,.ass,.ssa,.vtt";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // 监听文件选择事件
  fileInput.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      document.body.removeChild(fileInput);
      return;
    }

    try {
      // 调用store中的方法处理上传的字幕文件
      await animeStore.uploadLocalSubtitle(file);
      message.success(`字幕 "${file.name}" 上传成功`);
    } catch (error) {
      message.error(`字幕上传失败: ${error}`);
    } finally {
      document.body.removeChild(fileInput);
    }
  };

  // 触发文件选择对话框
  fileInput.click();
}

// 清除本地上传的字幕
function handleClearLocalSubtitle() {
  animeStore.clearLocalSubtitle();
}
</script>
