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
  <div v-if="!father.loading">
    <!-- 选集 -->
    <div class="w-full border rounded-md bg-white opacity-90 px-4 py-2 select-none">
      <div class="text-lg">筛选集数 (Beta) <span v-if="father.selectedVideoList != 'all'" class="text-sm text-gray-600">(已选
          {{ father.selectedVideoList }})</span></div>
      <div class="flex flex-wrap py-2">
        <div class="bg-gray-100 text-blue-600 hover:bg-gray-200 text-center
        px-2.5 py-2 lg:px-2 lg:py-1.5 mr-1 mb-1 rounded
        ease-in duration-200" @click="father.selectedVideoList = 'all'">
          全部
        </div>
        <div v-for="key in epKeys" class="bg-gray-100 text-blue-600 hover:bg-gray-200 text-center
        px-2.5 py-2 lg:px-2 lg:py-1.5 mr-1 mb-1 rounded
        ease-in duration-200" @click="father.selectedVideoList = key">
          {{ key }}
        </div>
      </div>
      <!-- 视频列表，默认渲染所有资源，可通过上方的 father.selectedVideoList 控制渲染哪些集数 -->
      <div v-for="video in father.epVideoList[father.selectedVideoList] || father.videoList"
        class="relative ease-in duration-200 hover:bg-zinc-200 leading rounded-md">
        <div v-if="video.type == 'file'" class="py-1">
          <n-tag class="absolute bottom-0 right-0" v-if="father.selectedVideoList == 'all'" size="small" type="warning">
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
  </div>
</template>