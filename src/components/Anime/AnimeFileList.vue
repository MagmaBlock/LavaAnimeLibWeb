<script>
export default {
  props: {
    father: Object
  },
  data() {
    return {
      epKeys: Object.keys(this.father.epVideoList).sort()
    }
  },
  methods: {}
}
</script>
<template>
  <!-- 总容器 -->
  <BasicCard v-if="!father.loading" class="px-4 py-2 select-none">
    <!-- 标题 -->
    <div class="text-lg">
      筛选集数
      <span v-if="father.selectedVideoList != 'all'" class="text-sm text-gray-600">
        (已选 {{ father.selectedVideoList }})
      </span>
    </div>
    <!-- 集数容器 -->
    <div class="flex flex-wrap gap-1 my-2">
      <div class="active:bg-blue-600 active:text-white text-sm sm:text-xs cursor-pointer ease-in duration-100
        flex items-center place-content-center h-9 w-12 sm:h-8 sm:w-11 rounded"
        :class="father.selectedVideoList == 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-gray-200 hover:text-blue-600'"
        @click="father.selectedVideoList = 'all'">
        全部
      </div>
      <!-- 各集数 -->
      <div v-for="key in epKeys" class="active:bg-blue-600 active:text-white cursor-pointer ease-in duration-100
        flex items-center place-content-center h-9 w-9 sm:h-8 sm:w-8 rounded"
        :class="father.selectedVideoList == key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-gray-200 hover:text-blue-600'"
        @click="father.selectedVideoList = key">
        {{ key }}
      </div>
    </div>
    <div class="max-h-80 sm:h-[400px] overflow-auto">
      <!-- 视频列表，默认渲染所有资源，可通过上方的 father.selectedVideoList 控制渲染哪些集数 -->
      <div v-for="video in father.epVideoList[father.selectedVideoList] || father.videoList"
        class="relative hover:bg-gray-200 active:bg-gray-300 p-0.5 leading rounded ease-in duration-100"
        :class="father.selectedVideo.name == video.name ? 'bg-gray-200' : ''">
        <div v-if="video.type == 'file'" class="cursor-pointer" @click="father.selectedVideo = video">
          <!-- 集数 -->
          <n-tag class="absolute bottom-0 right-0 z-10 bg-white bg-opacity-50"
            v-if="father.selectedVideoList == 'all' && video.episode" size="small" type="warning">
            {{ video.episode }}
          </n-tag>
          <!-- 发布组 -->
          <span v-for="group in video.groupNames" class="inline-flex">
            <n-tag size="small" :bordered="false" type="info" class="mx-0.5 my-0.5">
              {{ group }}
            </n-tag>
          </span>
          <!-- 普通标签 -->
          <span v-for="tag in video.tagedName" class="inline-flex">
            <span v-if="typeof tag == 'string'" class="mx-0.5">{{ tag }}</span>
            <n-tag v-if="typeof tag == 'object' && tag.type == 'source'" class="mx-0.5 my-0.5" type="success"
              size="small" :bordered="false">
              {{ tag.result }}
            </n-tag>
            <n-tag v-if="typeof tag == 'object' && tag.type == 'quality'" class="mx-0.5 my-0.5" size="small"
              :bordered="false">
              {{ tag.result }}
            </n-tag>
            <n-tag v-if="typeof tag == 'object' && tag.type == 'language'" class="mx-0.5 my-0.5" type="info"
              size="small" :bordered="false">
              {{ tag.result }}
            </n-tag>
            <n-tag v-if="typeof tag == 'object' && tag.type == 'other'" class="mx-0.5 my-0.5" type="warning"
              size="small" :bordered="false">
              {{ tag.result }}
            </n-tag>
          </span>
          <!-- 资源格式 -->
          <n-tag class="mx-0.5 my-0.5 inline-flex bg-gray-400 text-white font-medium" size="small" :bordered="false">
            {{ video.extensionName.result }}
          </n-tag>
        </div>
      </div>
    </div>
  </BasicCard>
</template>