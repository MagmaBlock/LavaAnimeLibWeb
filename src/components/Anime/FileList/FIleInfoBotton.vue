<template>
  <div
      :class="active ? 'border-2 border-blue-500' : ''"
      class="relative hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 p-0.5 leading rounded ease-in duration-100">
    <div v-if="video.type == 'file'" class="cursor-pointer" @click="">
      <!-- 集数
      <n-tag class="absolute bottom-0 right-0 z-10 bg-opacity-50" v-if="video.episode" size="small" type="warning">
        {{ video.episode }}
      </n-tag> -->
      <!-- 发布组 -->
      <span v-for="group in video.groupNames" class="inline-flex">
        <n-tag :bordered="false" class="mx-0.5 my-0.5" size="small" type="info">
          {{ group }}
        </n-tag>
      </span>
      <!-- 普通标签 -->
      <span v-for="tag in video.tagedName" class="inline-flex">
        <span v-if="typeof tag == 'string'" class="mx-0.5">{{ tag }}</span>
        <n-tag v-if="typeof tag == 'object' && tag.type == 'source'" :bordered="false" class="mx-0.5 my-0.5" size="small"
               type="success">
          {{ tag.result }}
        </n-tag>
        <n-tag v-if="typeof tag == 'object' && tag.type == 'quality'" :bordered="false" class="mx-0.5 my-0.5"
               size="small">
          {{ tag.result }}
        </n-tag>
        <n-tag v-if="typeof tag == 'object' && tag.type == 'language'" :bordered="false" class="mx-0.5 my-0.5" size="small"
               type="info">
          {{ tag.result }}
        </n-tag>
        <n-tag v-if="typeof tag == 'object' && tag.type == 'other'" :bordered="false" class="mx-0.5 my-0.5" size="small"
               type="warning">
          {{ tag.result }}
        </n-tag>
      </span>
      <!-- 资源格式 -->
      <n-tag :bordered="false" class="mx-0.5 my-0.5 inline-flex bg-gray-400 dark:bg-zinc-700 text-white font-medium"
             size="small">
        {{ video.extensionName.result }}
      </n-tag>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    video: Object,
    active: Boolean
  },
  data() {
    return {}
  },
  methods: {}
}
</script>