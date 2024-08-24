<template>
  <NCard
    :bordered="false"
    size="small"
    title="附件"
    v-if="mirrorGroupsNoEpisodeBind && mirrorGroupsNoEpisodeBind.length > 0"
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
              v-for="mirrorGroup in getFilesByType(type.value)"
              :key="mirrorGroup.fileIds[0]"
              trigger="hover"
              v-if="!isAudioOrVideo(type.value)"
            >
              <template #trigger>
                <AnimeEpisodeDetailsFileDisplay
                  class="w-full"
                  :groups="mirrorGroup.parseResult.group.map((g: any) => g?.parsedName ?? g?.name) ?? []"
                  :title="mirrorGroup.parseResult.title ?? ''"
                  :subtitles="
                    mirrorGroup.parseResult.subtitle.language
                      .map((l: any) => l.toString())
                      .concat(mirrorGroup.parseResult.subtitle.subtitleFeatures ?? []) ?? []
                  "
                  :sources="
                    (
                      mirrorGroup.parseResult.source.broadcastChannel ?? []
                    ).concat(mirrorGroup.parseResult.source.mediaType ?? [])
                  "
                  :quality="
                    [
                      mirrorGroup.parseResult.quality.audioCodec,
                      mirrorGroup.parseResult.quality.color,
                      mirrorGroup.parseResult.quality.fps,
                      mirrorGroup.parseResult.quality.resolution,
                      mirrorGroup.parseResult.quality.videoCodec,
                    ].filter((q: any) => q !== null)
                  "
                  :extension="mirrorGroup.parseResult.extension.parsedName"
                  :fileName="mirrorGroup.fileName"
                  @click="downloadFile(mirrorGroup)"
                />
              </template>
              点击下载，文件大小：{{ getFileSize(mirrorGroup) }}
            </NPopover>
            <AnimeEpisodeDetailsFileDisplay
              v-else
              v-for="mirrorGroup in getFilesByType(type.value)"
              class="w-full"
              :key="mirrorGroup.fileName"
              :groups="mirrorGroup.parseResult.group.map((g: any) => g?.parsedName ?? g?.name) ?? []"
              :title="mirrorGroup.parseResult.title ?? ''"
              :subtitles="
                mirrorGroup.parseResult.subtitle.language
                  .map((l: any) => l.toString())
                  .concat(mirrorGroup.parseResult.subtitle.subtitleFeatures ?? []) ?? []
              "
              :sources="
                (mirrorGroup.parseResult.source.broadcastChannel ?? []).concat(
                  mirrorGroup.parseResult.source.mediaType ?? []
                )
              "
              :quality="
                [
                  mirrorGroup.parseResult.quality.audioCodec,
                  mirrorGroup.parseResult.quality.color,
                  mirrorGroup.parseResult.quality.fps,
                  mirrorGroup.parseResult.quality.resolution,
                  mirrorGroup.parseResult.quality.videoCodec,
                ].filter((q: any) => q !== null)
              "
              :extension="mirrorGroup.parseResult.extension.parsedName"
              :fileName="mirrorGroup.fileName"
              :active="store.activeMirrorGroupName === mirrorGroup.fileName"
              @click="setActiveMirrorGroupName(mirrorGroup.fileName)"
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

// 没有绑定到剧集的 MirrorGroup 文件
const mirrorGroupsNoEpisodeBind = computed(() => {
  // 过滤掉有剧集绑定的 MirrorGroup
  return store.mainData?.mirrorGroups.filter((mirrorGroup) => {
    // 寻找当前 MirrorGroup 是否在任何一个剧集的 mirrorGroupNames 中
    return !store.mainData?.episodes.find((episode) =>
      episode.mirrorGroupNames.includes(mirrorGroup.fileName)
    );
  });
});

// 按类型获取文件
const getFilesByType = (type: FileType) =>
  mirrorGroupsNoEpisodeBind.value?.filter((mirrorGroup) => {
    const file = store.mainData?.files.find(
      (f) => f.id === mirrorGroup.fileIds[0]
    );
    return file?.type === type;
  }) ?? [];

// 计算可用的文件类型
const availableFileTypes = computed(() =>
  fileTypes.filter((type) => getFilesByType(type.value).length > 0)
);

const setActiveMirrorGroupName = (groupName: string) => {
  store.activeMirrorGroupName = groupName;
  store.activeEpisodeId = null;
};

const isAudioOrVideo = (type: FileType) => {
  return type === FileType.Audio || type === FileType.Video;
};

const getFileSize = (mirrorGroup: any) => {
  const file = store.mainData?.files.find(
    (f) => f.id === mirrorGroup.fileIds[0]
  );
  return file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` : "未知";
};

const downloadFile = async (mirrorGroup: any) => {
  try {
    const fileId = mirrorGroup.fileIds[0];
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
