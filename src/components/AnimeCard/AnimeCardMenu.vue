<template>
  <n-list hoverable class="sm:w-80 select-none">
    <n-list-item class="select-text">
      <div class="text-lg">{{ anime?.title || '...' }}</div>
      <div class="text-xs">{{ anime?.index?.year }} {{ anime?.index?.type }}</div>
      <template #suffix>
        <div v-if="anime.id" @click="$router.push({ name: 'Anime', params: { la: anime.id } })" class="cursor-pointer">
          <i class="bi bi-chevron-right"></i>
        </div>
      </template>
    </n-list-item>

    <!-- -1 未追番 -->
    <n-list-item @click="editFollow(1)" v-if="followInfo.status == -1">
      <i class="bi bi-heart"></i> 添加到追番
    </n-list-item>
    <!-- 0-2 已追番 -->
    <n-list-item class="text-blue-400" @click="editFollow(undefined, true)" v-else-if="followInfo.status >= 0">
      <i class="bi bi-heart-fill"></i> 取消追番
    </n-list-item>
    <!-- undefined 加载中, -2 错误 -->
    <n-list-item v-else-if="followInfo.status != -2">
      <n-skeleton text />
    </n-list-item>

    <n-list-item v-if="followInfo.status != -2">
      <i class="bi bi-bookmark-plus-fill"></i> 标记为
      <template #suffix>
        <n-button-group size="tiny">
          <n-button secondary :type="followInfo?.status == 0 ? 'primary' : 'default'"
            @click="editFollow(0)">想看</n-button>
          <n-button secondary :type="followInfo?.status == 1 ? 'primary' : 'default'"
            @click="editFollow(1)">在看</n-button>
          <n-button secondary :type="followInfo?.status == 2 ? 'primary' : 'default'"
            @click="editFollow(2)">看过</n-button>
        </n-button-group>
      </template>
    </n-list-item>

    <n-list-item v-if="anime?.bgmId">
      <a :href="anime?.images.large" target="_blank">
        <i class="bi bi-image-fill"></i> 查看封面大图
      </a>
    </n-list-item>

    <n-list-item v-if="anime?.bgmId">
      <a :href="'https://bgm.tv/subject/' + anime.bgmId" target="_blank">
        <i class="bi bi-arrow-up-right-square-fill"></i> 去番组计划查看本作品
      </a>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { ref } from 'vue';
import { lavaAnimeAPIs } from '../../common/api';

const { anime } = defineProps({
  anime: { type: Object }
})
const followInfo = ref({})

getFollowInfo()
async function getFollowInfo() {
  if (anime?.id) {
    try {
      let info = await lavaAnimeAPIs.getAnimeFollowInfoAPI(anime?.id)
      if (info.data.data) {
        followInfo.value = info.data.data
      }
    } catch (error) {
      followInfo.value = { status: -2 }
    }
  }
}

async function editFollow(status, remove) {
  let followedBefore = followInfo.value?.status != -1
  try {
    let result = await lavaAnimeAPIs.editAnimeFollowAPI(anime?.id, status, remove)
    if (result.data?.code == 200) {
      if (!followedBefore && !remove) window.$message.success("自己追的番就要好好看完哦^O^")
      if (remove) window.$message.success("已取消追番")
    }
  } catch (error) { }

  getFollowInfo()
}


</script>
