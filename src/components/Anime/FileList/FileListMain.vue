<script>
import AnimeBasicCard from '../Cards/AnimeBasicCard.vue';
import AnimeFlodCard from '../Cards/AnimeFlodCard.vue';
import FIleInfoBotton from './FIleInfoBotton.vue';

export default {
  inject: ['changePlayingFile'],
  props: {
    laData: Object,
    fileList: Array,
    selectedFile: Object,
  },
  data() {
    return {
      epKeys: [],
      selectKey: '',
      epSwitchLock: false,
      epfileList: {},
      otherFileList: {
        other: [],
        music: [],
        unknowVideo: []
      },
      bottonClass: {
        default: 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:text-white active:bg-blue-600 active:text-white',
        active: 'bg-blue-600 text-white'
      },
      showEpList: false
    }
  },
  methods: {
    splitfileList() {
      this.epfileList = {}
      this.fileList.forEach(video => {
        if (video.type == 'dir') return
        if (video.extensionName.type == 'video') { // 视频处理
          if (video.episode) { // 当前集数已识别出集数
            if (!this.epfileList[video.episode]) { // 如果 epfileList 没有相应集数的数组，创建相应数组
              this.epfileList[video.episode] = new Array()
            }
            this.epfileList[video.episode].push(video) // 
          } else {
            this.otherFileList.unknowVideo.push(video)
          }
        } else if (video.extensionName.type == 'music') { // 单独列出音乐类型
          this.otherFileList.music.push(video)
        }
        else { // 非视频单独显示
          this.otherFileList.other.push(video)
        }
      })
      this.epKeys = Object.keys(this.epfileList).sort()
    },
    clickEpButton(key) {
      if (this.epSwitchLock) return // 锁定期间不可用
      this.showEpList = false // 隐藏列表
      if (this.selectKey == key) { // 点击已经选择
        this.selectKey = ''
        return
      }
      this.selectKey = key // 修改已选 Key
      this.epSwitchLock = true
      let thisEpVideos = this.epfileList[key]
      this.changePlayingFile(thisEpVideos[0], false) // 提交视频更改事件
      setTimeout(() => {
        this.showEpList = true // 显示列表
      }, 300);
      setTimeout(() => {
        this.epSwitchLock = false
      }, 500);
    }
  },
  mounted() {
    this.splitfileList()
  },
  watch: {
    fileList() {
      this.splitfileList()
    }
  },
  components: { AnimeBasicCard, FIleInfoBotton, AnimeFlodCard }
}
</script>
<template>
  <!-- 总容器 -->
  <div v-if="fileList.length">
    <!-- 识别到集数的视频 -->
    <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="epKeys.length">
      <!-- 标题 -->
      <div class="text-base px-0.5 mb-2">正片</div>
      <!-- 集数容器 -->
      <div class="grid grid-cols-6 gap-1">
        <!-- 各集数 -->
        <template v-for="key in epKeys">
          <div class="cursor-pointer ease-in duration-100 rounded overflow-hidden
            h-10 grid content-center relative" :class="selectKey == key ? bottonClass.active : bottonClass.default"
            @click="clickEpButton(key)">
            <div class="leading-none pb-0.5 text-center">
              {{ key }}
            </div>
            <div class="text-xs text-center leading-none h-2 scale-75" v-if="epfileList[key].length > 1">
              {{ epfileList[key].length }}
            </div>
            <div class="absolute inset-0 border-blue-600 border-2 rounded"
              v-if="selectedFile.episode == key && selectKey !== key">
            </div>
          </div>
        </template>
      </div>
      <div>
        <!-- 选中的 EP 视频列表 -->
        <n-collapse-transition :show="showEpList">
          <div class="my-1">
            <template v-for="video in epfileList[selectKey]">
              <FIleInfoBotton :video="video" @click="changePlayingFile(video, true)"
                :active="video.name == selectedFile.name" />
            </template>
          </div>
        </n-collapse-transition>
      </div>
    </AnimeBasicCard>


    <!-- 未识别到集数的视频 -->
    <AnimeFlodCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.unknowVideo.length"
      :mobile-show="!epKeys.length">
      <!-- 标题 -->
      <template #title>
        {{ epKeys.length ? '其他视频' : '视频' }}
        <span class="text-sm text-zinc-500">
          {{ otherFileList.unknowVideo.length }}
        </span>
      </template>
      <!-- 其他文件显示 -->
      <template v-for="file in otherFileList.unknowVideo">
        <FIleInfoBotton :video="file" @click="changePlayingFile(file, false)"
          :active="file.name == selectedFile.name" />
      </template>
    </AnimeFlodCard>


    <!-- 音乐 -->
    <AnimeFlodCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.music.length">
      <!-- 标题 -->
      <template #title>
        相关音乐
        <span class="text-sm text-zinc-500">
          {{ otherFileList.music.length }}
        </span>
      </template>
      <!-- 其他文件显示 -->
      <template v-for="file in otherFileList.music">
        <FIleInfoBotton :video="file" @click="changePlayingFile(file)" :active="file.name == selectedFile.name" />
      </template>
    </AnimeFlodCard>


    <!-- 附件文件，以上都没匹配到的文件就会过来 -->
    <AnimeFlodCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.other.length">
      <!-- 标题 -->
      <template #title>
        附件
        <span class="text-sm text-zinc-500">
          {{ otherFileList.other.length }}
        </span>
      </template>
      <!-- 其他文件显示 -->
      <template v-for="file in otherFileList.other">
        <FIleInfoBotton :video="file" @click="changePlayingFile(file)" :active="file.name == selectedFile.name" />
      </template>
    </AnimeFlodCard>
  </div>


  <AnimeBasicCard v-else class="py-6 select-none">
    <n-result status="418" title="暂无资源 敬请期待" :description="`来自 Bangumi 的放送时间 ${laData.date || '未知 / 暂未定档'}`"
      size="small">
    </n-result>
  </AnimeBasicCard>
</template>