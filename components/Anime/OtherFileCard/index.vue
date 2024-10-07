<template>
  <NCard
    :bordered="false"
    size="small"
    title="附件"
    v-if="similarFilesNoEpisodeBind && similarFilesNoEpisodeBind.length > 0"
  >
    <NTabs type="segment" size="small" animated>
      <NTabPane
        v-for="type in availableFileTypes"
        :key="type.value"
        :name="type.value"
        :tab="type.label"
      >
        <NScrollbar class="max-h-64">
          <NFlex vertical>
            <NPopover
              v-for="similarFiles in getFilesByType(type.value)"
              :key="similarFiles.uniqueId"
              trigger="hover"
              v-if="!isAudioOrVideo(type.value)"
            >
              <template #trigger>
                <AnimeEpisodeDetailsFileDisplay
                  class="w-full"
                  :groups="
                    parseFileName(similarFiles.fileName).group.map(
                      (g) => g.parsedName ?? g.name
                    )
                  "
                  :title="parseFileName(similarFiles.fileName).title"
                  :subtitles="
                    parseFileName(similarFiles.fileName)
                      .subtitle.language.map((l) => l.toString())
                      .concat(
                        parseFileName(similarFiles.fileName).subtitle
                          .subtitleFeatures
                      )
                  "
                  :sources="
                    parseFileName(
                      similarFiles.fileName
                    ).source.broadcastChannel.concat(
                      parseFileName(similarFiles.fileName).source.mediaType
                    )
                  "
                  :quality="
                    [
                      parseFileName(similarFiles.fileName).quality.audioCodec,
                      parseFileName(similarFiles.fileName).quality.color,
                      parseFileName(similarFiles.fileName).quality.fps,
                      parseFileName(similarFiles.fileName).quality.resolution,
                      parseFileName(similarFiles.fileName).quality.videoCodec,
                    ].filter((q) => q !== null)
                  "
                  :extension="
                    parseFileName(similarFiles.fileName).extension.parsedName
                  "
                  :fileName="similarFiles.fileName"
                  @click="downloadFile(similarFiles)"
                />
              </template>
              点击下载，文件大小：{{ getFileSize(similarFiles) }}
            </NPopover>
            <AnimeEpisodeDetailsFileDisplay
              v-else
              v-for="similarFiles in getFilesByType(type.value)"
              class="w-full"
              :key="`${type.value}-${similarFiles.uniqueId}`"
              :groups="
                parseFileName(similarFiles.fileName).group.map(
                  (g) => g.parsedName ?? g.name
                )
              "
              :title="parseFileName(similarFiles.fileName).title ?? ''"
              :subtitles="
                parseFileName(similarFiles.fileName)
                  .subtitle.language.map((l) => l.toString())
                  .concat(
                    parseFileName(similarFiles.fileName).subtitle
                      .subtitleFeatures
                  )
              "
              :sources="
                parseFileName(
                  similarFiles.fileName
                ).source.broadcastChannel.concat(
                  parseFileName(similarFiles.fileName).source.mediaType
                )
              "
              :quality="
                [
                  parseFileName(similarFiles.fileName).quality.audioCodec,
                  parseFileName(similarFiles.fileName).quality.color,
                  parseFileName(similarFiles.fileName).quality.fps,
                  parseFileName(similarFiles.fileName).quality.resolution,
                  parseFileName(similarFiles.fileName).quality.videoCodec,
                ].filter((q) => q !== null)
              "
              :extension="
                parseFileName(similarFiles.fileName).extension.parsedName
              "
              :fileName="similarFiles.fileName"
              :active="store.activeSimilarFilesId === similarFiles.uniqueId"
              @click="setActiveSimilarFilesId(similarFiles.uniqueId)"
            />
          </NFlex>
        </NScrollbar>
      </NTabPane>
    </NTabs>
    <NSkeleton
      v-if="store.mainDataStatus === 'pending'"
      size="small"
      :sharp="false"
      :repeat="2"
    />
  </NCard>
</template>

<script lang="ts" setup>
import { FileType } from "@prisma/client";
import { parseFileName } from "anime-name-tool";
import type { SimilarFiles } from "~/server/services/anime/file/types/similar-files";

const store = useAnimeStore();
const { $client } = useNuxtApp();

// 文件类型及对应标签名称
const fileTypes: { value: FileType; label: string }[] = [
  { value: FileType.Video, label: "视频" },
  { value: FileType.Audio, label: "音频" },
  { value: FileType.Image, label: "图片" },
  { value: FileType.Document, label: "文档" },
  { value: FileType.Subtitle, label: "字幕" },
  { value: FileType.Archive, label: "压缩包" },
  { value: FileType.Seed, label: "种子" },
  { value: FileType.Other, label: "其他" },
];

// 没有绑定到剧集的 SimilarFiles
const similarFilesNoEpisodeBind = computed(() => {
  // 过滤掉有剧集绑定的 SimilarFiles
  return store.mainData?.similarFiles.filter((similarFiles) => {
    // 寻找当前 SimilarFiles 是否在任何一个剧集的 similarFilesIds 中
    return !store.mainData?.episodes.find((episode) =>
      episode.similarFilesIds.includes(similarFiles.uniqueId)
    );
  });
});

// 按类型获取文件
const getFilesByType = (type: FileType) =>
  similarFilesNoEpisodeBind.value?.filter((similarFiles) => {
    const file = store.mainData?.files.find(
      (f) => f.id === similarFiles.files[0]?.id
    );
    return file?.type === type;
  }) ?? [];

// 计算可用的文件类型
const availableFileTypes = computed(() =>
  fileTypes.filter((type) => getFilesByType(type.value).length > 0)
);

const setActiveSimilarFilesId = (uniqueId: string) => {
  store.activeSimilarFilesId = uniqueId;
  store.activeEpisodeId = null;
};

const isAudioOrVideo = (type: FileType) => {
  return type === FileType.Audio || type === FileType.Video;
};

const getFileSize = (similarFiles: SimilarFiles) => {
  return similarFiles.size
    ? `${(similarFiles.size / (1024 * 1024)).toFixed(2)}MB`
    : "未知";
};

const downloadFile = async (similarFiles: SimilarFiles) => {
  try {
    const fileId = similarFiles.files[0]?.id;
    if (!fileId) {
      console.error("无法获取文件ID");
      return;
    }
    const response = await $client.pages.anime.getFileTempUrls.query({
      fileIds: [fileId],
    });
    const tempUrl = response[0]?.tempUrl;
    if (tempUrl) {
      window.open(tempUrl, "_blank");
    } else {
      console.error("无法获取临时下载链接");
    }
  } catch (error) {
    console.error("获取临时下载链接时出错:", error);
  }
};
</script>

<style></style>
