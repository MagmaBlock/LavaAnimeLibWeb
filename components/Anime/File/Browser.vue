<template>
  <div>
    <!-- title -->
    <!-- <template #header>
      <div>文件浏览器</div>
    </template> -->
    <NFlex vertical>
      <NCard embedded size="small" class="sticky top-0 z-10">
        <NFlex vertical>
          <!-- Drive Select -->
          <NSelect
            :value="store.activeDrive?.id"
            @update:value="handleDriveSelect"
            :options="driveSelectList"
          />
          <!-- Action Buttons -->
          <NFlex>
            <NButton
              secondary
              @click="copySelectedLinks"
              :disabled="!hasSelectedFiles"
            >
              复制选中链接
            </NButton>
            <NButton
              secondary
              @click="copySelectedFileNamesAndLinks"
              :disabled="!hasSelectedFiles"
            >
              复制选中文件名 + 链接
            </NButton>
          </NFlex>
        </NFlex>
      </NCard>
      <!-- Content -->
      <div v-if="store.fileData?.fileList?.length">
        <!-- No Download alert -->
        <NEmpty
          v-if="!allowDownload"
          class="my-8"
          description="当前节点因带宽有限不开放批量下载，请使用其他节点"
        />

        <div v-if="allowDownload">
          <!-- File List -->
          <div
            v-for="file in store.fileData?.fileList"
            :key="file.url"
            class="mb-2"
          >
            <AnimeFileInfo
              v-if="file.url"
              :video="file"
              :active="selectedFiles[file.url]"
              @toggle-select="toggleSelect(file.url)"
              @click="toggleSelect(file.url)"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <NFlex vertical>
        <NSkeleton
          v-if="store.state.fileData.isLoading"
          v-for="a in 10"
          height="32px"
          :sharp="false"
        />
      </NFlex>
    </NFlex>
  </div>
</template>

<script lang="ts" setup>
// 引入 animeStore
const store = useAnimeStore();

// 用于存储选中的文件，键为文件的 URL，值为布尔值表示是否选中
const selectedFiles = ref<{ [key: string]: boolean }>({});

// 计算属性，生成驱动器选择列表
const driveSelectList = computed(() => {
  return store.driveData?.list.map((drive) => {
    return { label: drive.name + " / " + drive.description, value: drive.id };
  });
});

// 处理驱动器选择变化
const handleDriveSelect = (value: string) => {
  if (typeof value !== "string" || !value) return;
  store.changeDrive(value);
};

// 计算属性，判断是否允许下载
const allowDownload = computed(() => {
  return !store.activeDrive?.description?.includes("请勿下载");
});

// 计算属性，判断是否有选中的文件
const hasSelectedFiles = computed(() => {
  return Object.values(selectedFiles.value).some((selected) => selected);
});

// 切换文件选中状态
const toggleSelect = (url: string) => {
  selectedFiles.value[url] = !selectedFiles.value[url];
};

// 复制选中的文件链接
const copySelectedLinks = () => {
  const links = Object.entries(selectedFiles.value)
    .filter(([_, selected]) => selected)
    .map(([url]) => url)
    .join("\n");
  navigator.clipboard.writeText(links);
};

// 复制选中的文件名和链接
const copySelectedFileNamesAndLinks = () => {
  const selectedEntries = Object.entries(selectedFiles.value).filter(
    ([_, selected]) => selected
  );
  const fileNamesAndLinks = selectedEntries
    .map(([url], index) => {
      const file = store.fileData?.fileList?.find((f) => f.url === url);
      return file ? `${file.name} ${url}` : "";
    })
    .join("\n");
  navigator.clipboard.writeText(fileNamesAndLinks);
};
</script>

<style></style>
