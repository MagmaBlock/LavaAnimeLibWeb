<template>
  <n-list clickable hoverable class="sm:w-80 select-none">
    <n-list-item class="select-text">
      <div class="text-lg">{{ anime?.title || "..." }}</div>
      <div class="text-xs">
        {{ anime?.index?.year }} {{ anime?.index?.type }}
      </div>
      <template #suffix>
        <div
          v-if="anime.id"
          @click="$router.push({ name: 'Anime', params: { la: anime.id } })"
          class="cursor-pointer"
        >
          <ChevronRightOutlined class="h-6" />
        </div>
      </template>
    </n-list-item>

    <!-- -1 未追番 -->
    <n-list-item @click="editFollow(1)" v-if="followInfo.status == -1">
      <div class="flex gap-x-4 items-center">
        <PlusFilled class="h-6" />
        添加到追番
      </div>
    </n-list-item>
    <!-- 0-2 已追番 -->
    <n-list-item
      class="text-blue-400"
      @click="editFollow(undefined, true)"
      v-else-if="followInfo.status >= 0"
    >
      <div class="flex gap-x-4 items-center">
        <MinusFilled class="h-6" />
        取消追番
      </div>
    </n-list-item>
    <!-- undefined 加载中, -2 错误 -->
    <n-list-item v-else-if="followInfo.status != -2">
      <n-skeleton text />
    </n-list-item>

    <n-list-item v-if="followInfo.status != -2">
      <div class="flex gap-x-4 items-center">
        <BookmarkAddOutlined class="h-6" />
        标记为
      </div>
      <template #suffix>
        <div class="flex flex-nowrap">
          <n-tag
            :checked="followInfo?.status == 0"
            @click="editFollow(0)"
            checkable
          >
            想看
          </n-tag>
          <n-tag
            :checked="followInfo?.status == 1"
            @click="editFollow(1)"
            checkable
          >
            在看
          </n-tag>
          <n-tag
            :checked="followInfo?.status == 2"
            @click="editFollow(2)"
            checkable
          >
            看过
          </n-tag>
        </div>
      </template>
    </n-list-item>

    <n-list-item v-if="anime?.bgmId">
      <a :href="anime?.images.large" target="_blank">
        <div class="flex gap-x-4 items-center">
          <ImageOutlined class="h-6" />
          查看封面大图
        </div>
      </a>
    </n-list-item>

    <n-list-item v-if="anime?.bgmId">
      <a :href="'https://bgm.tv/subject/' + anime.bgmId" target="_blank">
        <div class="flex gap-x-4 items-center">
          <OpenInNewOutlined class="h-6" />
          去番组计划查看本作品
        </div>
      </a>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { ref } from "vue";
import { lavaAnimeAPIs } from "../../common/api";
import {
  PlusFilled,
  MinusFilled,
  BookmarkAddOutlined,
  ImageOutlined,
  OpenInNewOutlined,
  ChevronRightOutlined,
} from "@vicons/material";

const { anime } = defineProps({
  anime: { type: Object },
});
const followInfo = ref({});

getFollowInfo();
async function getFollowInfo() {
  if (anime?.id) {
    try {
      let info = await lavaAnimeAPIs.getAnimeFollowInfoAPI(anime?.id);
      if (info.data.data) {
        followInfo.value = info.data.data;
      }
    } catch (error) {
      followInfo.value = { status: -2 };
    }
  }
}

async function editFollow(status, remove) {
  let followedBefore = followInfo.value?.status != -1;
  try {
    let result = await lavaAnimeAPIs.editAnimeFollowAPI(
      anime?.id,
      status,
      remove
    );
    if (result.data?.code == 200) {
      if (!followedBefore && !remove)
        window.$message.success("自己追的番就要好好看完哦^O^");
      if (remove) window.$message.success("已取消追番");
    }
  } catch (error) {}

  getFollowInfo();
}
</script>
