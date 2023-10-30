<script setup>
const store = useAnimeStore();

const bottonClass = {
  default:
    "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:text-white active:bg-blue-600 active:text-white",
  active: "bg-blue-600 text-white",
};

const videoButtonClick = async (video) => {
  if (video.url === store.activeFile?.url) return;
  let result = await Promise.allSettled([
    store.getAnimeViewHistory(),
    store.changeVideo(video.url),
  ]);
  if (result[0].status !== "rejected") {
    let viewHistory = result[0].value;
    if (viewHistory.data.data.length) {
      let recentRecord = // 用名字或者相同集数跳进度
        viewHistory.data.data.find((record) => {
          return record.fileName == video.name;
        }) ??
        viewHistory.data.data.find((record) => {
          return record.episode == video?.parseResult?.episode;
        });
      store.seekByHistory(recentRecord);
    }
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
  <AnimeFileListLoading v-if="store.state.fileData.isLoading" />

  <div
    v-if="!store.state.fileData.isLoading && !store.state.fileData.errorCode"
  >
    <!-- 识别到集数的视频 -->
    <AnimeCardBasic
      class="px-4 py-2 sm:mb-4 select-none"
      v-if="store.episodeList.length"
    >
      <!-- 卡片标题 -->
      <div class="text-base px-0.5 mb-2">正片</div>
      <!-- 集数 Grid 容器 -->
      <div class="grid grid-cols-6 gap-1">
        <!-- 集数方块 -->
        <template v-for="episode in store.episodeList">
          <NPopover trigger="hover" :disabled="episode.list.length == 1">
            <template #trigger>
              <div
                class="cursor-pointer ease-in duration-100 rounded overflow-hidden h-10 grid content-center relative"
                :class="
                  store.fileData.activeEpisode == episode.episode
                    ? bottonClass.active
                    : bottonClass.default
                "
                @click="store.changeEpisodeAutoHistory(episode.episode)"
              >
                <!-- 集数 -->
                <div class="leading-none pb-0.5 text-center">
                  {{ episode.episode }}
                </div>
                <!-- 多集数时展现 -->
                <div
                  v-if="episode.list.length > 1"
                  class="absolute h-0.5 w-1.5 mx-auto inset-x-0 bottom-1 rounded"
                  :class="
                    store.fileData.activeEpisode == episode.episode
                      ? 'bg-gray-50'
                      : 'bg-gray-400'
                  "
                ></div>
              </div>
            </template>
            <span>当前集数有 {{ episode.list.length }} 个视频</span>
          </NPopover>
        </template>
      </div>
      <div>
        <NCollapseTransition :show="!!store.fileData?.activeEpisode">
          <div class="my-1">
            <Transition mode="out-in" name="fade">
              <div :key="store.fileData?.activeEpisode">
                <AnimeFileInfo
                  v-for="video in store.episodeListFind(
                    store.fileData.activeEpisode
                  ).list"
                  :video="video"
                  @click="videoButtonClick(video)"
                  :active="video.name == store.activeFile?.name"
                />
              </div>
            </Transition>
          </div>
        </NCollapseTransition>
      </div>
    </AnimeCardBasic>

    <!-- 未识别到集数的视频 -->
    <AnimeCardFlod
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
        <AnimeFileInfo
          :video="video"
          @click="videoButtonClick(video)"
          :active="video.name == store.activeFile?.name"
        />
      </template>
    </AnimeCardFlod>

    <!-- 音乐 -->
    <AnimeCardFlod
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
        <AnimeFileInfo
          :video="file"
          @click="store.changeVideo(file.url, true)"
          :active="file.name == store.activeFile?.name"
        />
      </template>
    </AnimeCardFlod>

    <!-- 附件文件，以上都没匹配到的文件就会过来 -->
    <AnimeCardFlod
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
        <NPopover trigger="hover">
          <template #trigger>
            <a :href="file?.url" target="_blank" rel="noopener noreferrer">
              <AnimeFileInfo :video="file" />
            </a>
          </template>
          <span>
            这是一个 {{ file?.parseResult?.extensionName?.result }} 附件, 大小
            {{ bytesToSize(file?.size) }}, 点击可以下载
          </span>
        </NPopover>
      </template>
    </AnimeCardFlod>
  </div>

  <AnimeCardBasic
    v-if="
      !store.state.fileData.isLoading &&
      !store.state.fileData.errorCode &&
      !store.fileData.fileList.length
    "
    class="py-6 sm:mb-4 select-none"
  >
    <NResult
      status="418"
      title="暂无资源 敬请期待"
      :description="`来自 Bangumi 的放送时间 ${
        store.animeData.date || '未知 / 暂未定档'
      }`"
      size="small"
    >
    </NResult>
  </AnimeCardBasic>
</template>
