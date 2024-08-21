<template>
  <div
    class="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 rounded-lg transition"
    :class="active ? 'border-2 border-blue-500' : ''"
  >
    <div class="flex flex-wrap gap-1">
      <!-- 发布组 -->
      <NTag
        v-if="groups"
        v-for="tag in groups"
        type="info"
        size="small"
        :bordered="false"
      >
        {{ tag }}
      </NTag>
      <!-- 标题 -->
      <span v-if="title">{{ title }}</span>
      <!-- 字幕 -->
      <NTag
        v-if="subtitles"
        v-for="tag in subtitles"
        type="info"
        size="small"
        :bordered="false"
      >
        {{ tag }}
      </NTag>
      <!-- 来源 -->
      <NTag
        v-if="sources"
        v-for="tag in sources"
        type="success"
        size="small"
        :bordered="false"
      >
        {{ tag }}
      </NTag>
      <!-- 质量 -->
      <NTag
        v-if="quality"
        v-for="tag in quality"
        size="small"
        :bordered="false"
      >
        {{ tag }}
      </NTag>
      <!-- 格式 -->
      <NTag
        v-if="extension"
        class="bg-gray-400 dark:bg-zinc-700 text-white font-medium"
        size="small"
        :bordered="false"
      >
        {{ extension }}
      </NTag>
    </div>

    <!-- 文件名 -->
    <span v-if="fileName" class="text-xs opacity-75 leading-none">{{
      fileName
    }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  groups?: string[];
  title?: string | null;
  subtitles?: string[];
  sources?: string[];
  quality?: string[];
  extension?: string | null;
  fileName?: string;
  active?: boolean;
}>();

const tagType = {
  group: "info",
  source: "success",
  quality: "",
  language: "info",
  other: "warning",
};
</script>
