<template>
  <div v-if="notice">
    <AnimeCardBasic>
      <div class="flex space-x-3 items-center">
        <div class="text-xs">{{ notice }}</div>
      </div>
    </AnimeCardBasic>
  </div>
</template>

<script lang="ts" setup>
const store = useAnimeStore();

/**
 * 获取 notice
 *
 * @returns {String | null}
 */
const notice = computed(() => {
  const fileList = store.fileData?.fileList;
  // 确保 fileList 是数组且不为空
  if (Array.isArray(fileList) && fileList.length > 0) {
    // 查找 .notice 结尾的文件
    const noticeFile = fileList.find((file) => {
      // 确保 file 和 file.name 不为空
      return file?.name && typeof file.name === 'string' && file.name.endsWith(".notice");
    });
    // 确保找到的文件和文件名不为空
    if (noticeFile?.name) {
      return noticeFile.name.replace(/\.notice$/, "");
    }
  }
  return null;
});
</script>

<style></style>
