<template>
  <NSpace :size="[8, 6]">
    <!-- 正常 -->
    <template v-if="Array.isArray(tags)">
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
    <!-- 骨架 -->
    <template v-for="a in 20" v-if="loading">
      <NSkeleton :width="80 - 50 * Math.random()" :height="22" />
    </template>
  </NSpace>
</template>

<script lang="ts" setup>
defineProps<{
  tags?: Tag[];
  loading?: boolean;
}>();

export type Tag = {
  name: string;
  count: number;
};

const showMore = ref(false);
</script>

<style></style>
