<script setup>
import { useLocalStorage } from "@vueuse/core";

const store = useAnimeStore();
const ascOrder = useLocalStorage("AnimeFileAscOrder", true);

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
</script>
<template>
  <div>
    <!-- Loading -->
    <AnimeFileListLoading v-if="store.state.fileData.isLoading" />

    <!-- 正常 -->
    <AnimeCardBasic
      v-if="
        !store.state.fileData.isLoading &&
        !store.state.fileData.errorCode &&
        store.fileData.fileList.length
      "
    >
      <!-- 卡片标题 -->
      <template #header>
        <div class="flex place-items-center" @click="ascOrder = !ascOrder">
          <div>播放列表</div>
          <div class="flex-1"></div>
          <Icon name="mdi:sort-ascending" size="16" v-if="ascOrder" />
          <Icon name="mdi:sort-descending" size="16" v-else />
        </div>
      </template>
      <!-- 视频的各个分类 -->
      <NTabs type="bar" size="small" animated>
        <!-- 有集数时的正片 -->
        <NTabPane name="正片" tab="正片" v-if="store.episodeList.length">
          <!-- 正片集数方块 -->
          <div class="grid grid-cols-6 gap-1">
            <!-- 集数方块 -->
            <NPopover
              trigger="hover"
              :disabled="episode.list.length == 1"
              v-for="episode in store.episodeList"
            >
              <template #trigger>
                <AnimeCardButton
                  class="relative h-10 grid content-center"
                  :active="store.fileData.activeEpisode == episode.episode"
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
                </AnimeCardButton>
              </template>
              <span>当前集数有 {{ episode.list.length }} 个视频</span>
            </NPopover>
          </div>
          <!-- 正片集数列表 -->
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
        </NTabPane>

        <!-- 未识别到集数的视频 -->
        <NTabPane
          name="无集数视频"
          :tab="
            store.episodeList.length
              ? `相关视频 (${store.noEpisodeList.length})`
              : `视频 (${store.noEpisodeList.length})`
          "
          v-if="store.noEpisodeList.length"
        >
          <!-- 其他视频显示 -->
          <AnimeFileInfo
            v-for="video in store.noEpisodeList"
            :video="video"
            @click="videoButtonClick(video)"
            :active="video.name == store.activeFile?.name"
          />
        </NTabPane>

        <!-- 音乐 -->
        <NTabPane
          name="音乐"
          :tab="`音乐 (${store.musicList.length})`"
          v-if="store.musicList.length"
        >
          <AnimeFileInfo
            :video="file"
            @click="store.changeVideo(file.url, true)"
            :active="file.name == store.activeFile?.name"
            v-for="file in store.musicList"
          />
        </NTabPane>

        <!-- 附件文件，以上都没匹配到的文件就会过来 -->
        <NTabPane
          name="附件"
          :tab="`附件 (${store.otherList.length})`"
          v-if="store.otherList.length"
        >
          <NPopover trigger="hover" v-for="file in store.otherList">
            <template #trigger>
              <a :href="file?.url" target="_blank" rel="noopener noreferrer">
                <AnimeFileInfo :video="file" />
              </a>
            </template>
            <span>
              这是一个 {{ file?.parseResult?.extensionName?.result }} 附件, 大小
              {{ useBytesToSize(file?.size) }}, 点击可以下载
            </span>
          </NPopover>
        </NTabPane>
      </NTabs>
    </AnimeCardBasic>

    <!-- 404 -->
    <AnimeCardBasic
      v-if="
        !store.state.fileData.isLoading &&
        !store.state.fileData.errorCode &&
        !store.fileData.fileList.length
      "
      class="py-6"
    >
      <NResult status="418" title="此节点中暂无文件" size="small" />
      <div class="text-center">
        <div class="text-base my-1">可能原因</div>
        <ul>
          <li>1. 当前节点不含有此动画</li>
          <li>
            2. 当前动画暂无资源或未放送，根据 Bangumi，开播时间为
            {{ store.animeData.date || "未知 / 暂未定档" }}
          </li>
        </ul>
      </div>
    </AnimeCardBasic>
  </div>
</template>
