<script>
import AnimeBasicCard from '../AnimeBasicCard.vue';
import FIleInfoBotton from './FIleInfoBotton.vue';

export default {
  emits: ['videoChange'],
  props: {
    laData: Object,
    videoList: Array,
    selectedVideo: Object
  },
  data() {
    return {
      epKeys: [],
      selectKey: '',
      epSwitchLock: false,
      epVideoList: {},
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
    splitVideoList() {
      this.videoList.forEach(video => {
        if (video.type == 'dir') return
        if (video.extensionName.type == 'video') { // 视频处理
          if (video.episode) { // 当前集数已识别出集数
            if (!this.epVideoList[video.episode]) { // 如果 epVideoList 没有相应集数的数组，创建相应数组
              this.epVideoList[video.episode] = new Array()
            }
            this.epVideoList[video.episode].push(video) // 
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
      let epKeys = Object.keys(this.epVideoList).sort()
      this.epKeys = epKeys
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
      let thisEpVideos = this.epVideoList[key]
      // if (thisEpVideos.length == 1) {
      this.$emit('videoChange', thisEpVideos[0])
      // }
      setTimeout(() => {
        this.showEpList = true // 显示列表
      }, 300);
      setTimeout(() => {
        this.epSwitchLock = false
      }, 2000);
    }
  },
  mounted() {
    this.splitVideoList()
  },
  watch: {
    videoList() {
      this.splitVideoList()
    }
  },
  components: { AnimeBasicCard, FIleInfoBotton }
}
</script>
<template>
  <!-- 总容器 -->
  <div v-if="videoList.length" class="">


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
            <div class="text-xs text-center leading-none h-2 scale-75" v-if="epVideoList[key].length > 1">
              {{ epVideoList[key].length }}
            </div>
            <div class="absolute inset-0 border-blue-600 border-2 rounded"
              v-if="selectedVideo.episode == key && selectKey !== key">
            </div>
          </div>
        </template>
      </div>
      <div>
        <!-- 选中的 EP 视频列表 -->
        <n-collapse-transition :show="showEpList">
          <div class="my-1">
            <template v-for="video in epVideoList[selectKey]">
              <FIleInfoBotton :video="video" @click="this.$emit('videoChange', video)"
                :active="video.name == selectedVideo.name" />
            </template>
          </div>
        </n-collapse-transition>
      </div>
    </AnimeBasicCard>


    <!-- 未识别到集数的视频 -->
    <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.unknowVideo.length">
      <!-- 标题 -->
      <div class="text-base px-0.5 mb-2">{{ epKeys.length ? '其他视频' : '视频' }}</div>
      <!-- 其他文件显示 -->
      <div>
        <template v-for="file in otherFileList.unknowVideo">
          <FIleInfoBotton :video="file" @click="this.$emit('videoChange', file)"
            :active="file.name == selectedVideo.name" />
        </template>
      </div>
    </AnimeBasicCard>


    <!-- 音乐 -->
    <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.music.length">
      <!-- 标题 -->
      <div class="text-base px-0.5 mb-2">相关音乐</div>
      <!-- 其他文件显示 -->
      <div>
        <template v-for="file in otherFileList.music">
          <FIleInfoBotton :video="file" @click="this.$emit('videoChange', file)"
            :active="file.name == selectedVideo.name" />
        </template>
      </div>
    </AnimeBasicCard>


    <!-- 附件文件，以上都没匹配到的文件就会过来 -->
    <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="otherFileList.other.length">
      <!-- 标题 -->
      <div class="text-base px-0.5 mb-2">附件</div>
      <!-- 其他文件显示 -->
      <div>
        <template v-for="file in otherFileList.other">
          <FIleInfoBotton :video="file" @click="this.$emit('videoChange', file)"
            :active="file.name == selectedVideo.name" />
        </template>
      </div>
    </AnimeBasicCard>
  </div>


  <AnimeBasicCard v-else class="py-6 select-none">
    <n-result status="418" title="暂无资源 敬请期待" :description="`来自 Bangumi 的放送时间 ${laData.date || '未知 / 暂未定档'}`"
      size="small">
    </n-result>
  </AnimeBasicCard>
</template>