<template>
  <NSpace :size="[8, 6]">
    <!-- 正常 -->
    <template v-if="Array.isArray(tags) && tags.length > 0">
      <template v-for="(tag, index) in tags" :key="index">
        <NTag
          v-if="index <= tags.length / 3 || showMore"
          size="small"
          class="max-w-xs overflow-hidden"
          :bordered="false"
        >
          {{ tag.name }} {{ tag.count }}
        </NTag>
      </template>
      <NTag
        size="small"
        class="mr-1 mb-1 text-gray-300 dark:text-zinc-200"
        :bordered="false"
        @click="showMore = !showMore"
        checkable
      >
        {{ showMore ? "收起" : "展开" }}
      </NTag>
    </template>
  </NSpace>
</template>

<script lang="ts" setup>
import type { AnimeTag } from "@prisma/client";

interface Props {
  tags?: AnimeTag[] | null | undefined;
}

defineProps<Props>();

const showMore = ref(false);
</script>

<style></style>
