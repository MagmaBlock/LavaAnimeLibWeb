<script>
import { isCollected, switchToMyCollections } from '@/common/Methods/MyCollections'

export default {
  props: {
    id: { type: [String, Number], default: -1 },
    poster: { type: String, default: '' },
    title: { type: String, default: '' },
    bgmid: { type: [String, Number], default: -1 },
    views: { type: [String, Number], default: 0 },
    nsfw: { type: Boolean, default: false },
    bdrip: { type: Boolean, default: false }
  },
  data() {
    return {
      collected: null,
    }
  },
  methods: {
    goToThisAnime(id) {
      if (parseInt(id)) this.$router.push('/anime/' + id)
      else return
    },
    updateCollected() {
      let collected = isCollected(this.id)
      this.collected = collected
      return collected
    },
    switchToMyCollections(laID) {
      switchToMyCollections(laID)
      this.updateCollected()
    },
  },
}
</script>

<template>
  <!-- 卡片 -->
  <div class="relative box-content overflow-hidden select-none
    rounded-md border-2 border-white/0
    transition-all ease-out hover:lg:scale-[1.03] hover:border-2 hover:border-blue-600 hover:shadow-lg">
    <div class="absolute h-full w-full bg-gray-100 dark:bg-gray-500"></div>

    <!-- 上半：海报 + 标题 -->
    <div class="relative cursor-pointer overflow-hidden">
      <RouterLink :to="{ name: 'Anime', params: { la: id } }">
        <!-- 图片容器 -->
        <div class="aspect-w-2 aspect-h-3 overflow-hidden">
          <img v-lazy="{
            src: poster,
            loading: 'https://bangumi-app-img.5t5.top/assets/PosterLoading.jpg',
            error: 'https://bangumi-app-img.5t5.top/assets/noposter.png',
          }" class="absolute object-cover" alt="封面图片" />
        </div>
        <!-- 标题 -->
        <div class="absolute inset-x-0 bottom-0 grid h-24 items-end break-all
        bg-gradient-to-b from-transparent to-black/75 px-3 py-3 text-[13px] text-white">
          <n-ellipsis :line-clamp="2" expand-trigger="hover">
            {{ title || '...' }}
            <!-- Special Tags -->
            <div v-if="bdrip" class="ml-0.5 inline-block rounded-sm px-1.5 text-xs font-medium
            bg-blue-400 bg-opacity-50 backdrop-blur-sm">
              BD
            </div>
            <div v-if="nsfw" class="ml-0.5 inline-block rounded-sm px-1.5 text-xs font-medium
           bg-yellow-300 bg-opacity-50 backdrop-blur-sm">
              NSFW
            </div>
          </n-ellipsis>
        </div>
      </RouterLink>
    </div>

    <!-- 信息区 -->
    <div class="relative h-8 dark:bg-zinc-700">
      <div class="flex h-full">
        <div class="grid basis-3/4 content-center pl-3">
          <div class="text-[13px]">
            <i class="bi bi-play-btn"></i> {{ views > 9999 ? (views / 10000).toFixed(2) + '万' : views}}
          </div>
        </div>
        <div class="grid basis-1/4 place-items-center">
          <!-- 菜单 -->
          <n-popover trigger="click" :show-arrow="false" raw>
            <template #trigger>
              <div class="cursor-pointer rounded p-1 hover:bg-black/20" @click="updateCollected()">
                <i class="bi bi-list text-zinc-700 dark:text-gray-50"></i>
              </div>
            </template>
            <div class="grid grid-cols-1 rounded bg-white dark:bg-zinc-700 dark:text-white p-1 select-none">
              <!-- 收藏 -->
              <div class="flex h-7 cursor-pointer flex-nowrap rounded hover:bg-black/20"
                @click="switchToMyCollections(id)">
                <!-- 已经收藏 -->
                <template v-if="collected">
                  <div class="grid w-8 place-items-center text-blue-600 dark:text-blue-400">
                    <i class="bi bi-star-fill"></i>
                  </div>
                  <div class="mr-2 grid place-items-center text-blue-600 dark:text-blue-400">
                    移除收藏
                  </div>
                </template>
                <!-- 没有收藏 -->
                <template v-else>
                  <div class="grid w-8 place-items-center">
                    <i class="bi bi-star"></i>
                  </div>
                  <div class="mr-2 grid place-items-center">添加到收藏</div>
                </template>
              </div>
              <!-- 番组计划 -->
              <a v-if="parseInt(bgmid)" :href="'https://bgm.tv/subject/' + bgmid" target="_blank"
                class="flex h-7 flex-nowrap rounded hover:bg-black/20">
                <div class="grid w-8 place-items-center">
                  <i class="bi bi-box-arrow-up-right"></i>
                </div>
                <div class="mr-2 grid place-items-center">
                  去番组计划查看资料
                </div>
              </a>
            </div>
          </n-popover>
        </div>
      </div>
    </div>
  </div>
</template>
