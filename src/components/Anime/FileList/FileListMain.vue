<script setup>
import { ref } from "vue";
import { useAnimeStore } from "../../../store/Anime";
import AnimeBasicCard from "../Cards/AnimeBasicCard.vue";
import AnimeFlodCard from "../Cards/AnimeFlodCard.vue";
import FileInfo from "./FileInfo.vue";

const store = useAnimeStore();

const bottonClass = {
  default:
    "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:text-white active:bg-blue-600 active:text-white",
  active: "bg-blue-600 text-white",
};

const epButtonClick = (episode) => {
  if (episode.episode !== store.fileData.activeEpisode) {
    store.changeEpisode(episode.episode);
  }
};

// 字节体积格式化
const bytesToSize = (bytes) => {
  if (bytes === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + "" + sizes[i];
};
</script>
<template>
  <FileListLoading v-if="store.state.fileData.isLoading" />

  <div
    v-if="!store.state.fileData.isLoading && !store.state.fileData.errorCode"
  >
    <!-- 识别到集数的视频 -->
    <AnimeBasicCard
      class="px-4 py-2 sm:mb-4 select-none"
      v-if="store.episodeList.length"
    >
      <!-- 卡片标题 -->
      <div class="text-base px-0.5 mb-2">正片</div>
      <!-- 集数 Grid 容器 -->
      <div class="grid grid-cols-6 gap-1">
        <!-- 集数方块 -->
        <template v-for="episode in store.episodeList">
          <n-popover trigger="hover" :disabled="episode.list.length == 1">
            <template #trigger>
              <div
                class="cursor-pointer ease-in duration-100 rounded overflow-hidden h-10 grid content-center relative"
                :class="
                  store.fileData.activeEpisode == episode.episode
                    ? bottonClass.active
                    : bottonClass.default
                "
                @click="epButtonClick(episode)"
              >
                <!-- 集数 -->
                <div class="leading-none pb-0.5 text-center">
                  {{ episode.episode }}
                </div>
                <!-- 多集数时展现 -->
                <div
                  v-if="episode.list.length > 1"
                  class="absolute h-0.5 w-1.5 mx-auto inset-x-0 bottom-1 rounded-full"
                  :class="
                    store.fileData.activeEpisode == episode.episode
                      ? 'bg-gray-50'
                      : 'bg-gray-400'
                  "
                ></div>
              </div>
            </template>
            <span>当前集数有 {{ episode.list.length }} 个视频</span>
          </n-popover>
        </template>
      </div>
      <div>
        <n-collapse-transition :show="store.fileData?.activeEpisode">
          <div class="my-1">
            <Transition
              leave-active-class="absolute animate__animated animate__zoomOut"
              enter-active-class="absolute animate__animated animate__zoomIn"
            >
              <div :key="store.fileData?.activeEpisode">
                <FileInfo
                  v-for="video in store.episodeListFind(
                    store.fileData.activeEpisode
                  ).list"
                  :video="video"
                  @click="store.changeVideo(video?.url)"
                  :active="video.name == store.activeFile?.name"
                />
              </div>
            </Transition>
          </div>
        </n-collapse-transition>
      </div>
    </AnimeBasicCard>

    <!-- 未识别到集数的视频 -->
    <AnimeFlodCard
      class="px-4 py-2 sm:mb-4 select-none"
      :mobile-show="!store.episodeList.length"
      v-if="store.noEpisodeList.length"
    >
      <!-- 标题 -->
      <template #title>
        {{ store.episodeList.length ? "其他视频" : "视频" }}
        <span class="text-sm text-zinc-500">
          {{ store.noEpisodeList.length }}
        </span>
      </template>
      <!-- 其他视频显示 -->
      <template v-for="video in store.noEpisodeList">
        <FileInfo
          :video="video"
          @click="store.changeVideo(video.url)"
          :active="video.name == store.activeFile?.name"
        />
      </template>
    </AnimeFlodCard>

    <!-- 音乐 -->
    <AnimeFlodCard
      v-if="store.musicList.length"
      class="px-4 py-2 sm:mb-4 select-none"
    >
      <!-- 标题 -->
      <template #title>
        相关音乐
        <span class="text-sm text-zinc-500">
          {{ store.musicList.length }}
        </span>
      </template>
      <!-- 其他文件显示 -->
      <template v-for="file in store.musicList">
        <FileInfo
          :video="file"
          @click="store.changeVideo(file.url, true)"
          :active="file.name == store.activeFile?.name"
        />
      </template>
    </AnimeFlodCard>

    <!-- 附件文件，以上都没匹配到的文件就会过来 -->
    <AnimeFlodCard
      v-if="store.otherList.length"
      class="px-4 py-2 sm:mb-4 select-none"
    >
      <!-- 标题 -->
      <template #title>
        附件
        <span class="text-sm text-zinc-500">
          {{ store.otherList.length }}
        </span>
      </template>
      <!-- 其他文件显示 -->
      <template v-for="file in store.otherList">
        <n-popover trigger="hover">
          <template #trigger>
            <a :href="file?.url" target="_blank" rel="noopener noreferrer">
              <FileInfo :video="file" />
            </a>
          </template>
          <span>
            这是一个 {{ file?.parseResult?.extensionName?.result }} 附件, 大小
            {{ bytesToSize(file?.size) }}, 点击可以下载
          </span>
        </n-popover>
      </template>
    </AnimeFlodCard>
  </div>

  <AnimeBasicCard
    v-if="
      !store.state.fileData.isLoading &&
      !store.state.fileData.errorCode &&
      !store.fileData.fileList.length
    "
    class="py-6 sm:mb-4 select-none"
  >
    <n-result
      status="418"
      title="暂无资源 敬请期待"
      :description="`来自 Bangumi 的放送时间 ${
        store.animeData.date || '未知 / 暂未定档'
      }`"
      size="small"
    >
    </n-result>
  </AnimeBasicCard>
</template>
