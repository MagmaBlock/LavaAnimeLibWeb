<template>
  <n-list hoverable class="sm:w-80 select-none">
    <n-list-item class="select-text">
      <div class="text-lg">{{ anime?.title || '...' }}</div>
    </n-list-item>
    <n-list-item>
      <i class="bi bi-plus-circle"></i> 追番
      <template #suffix>
        <div>
          <n-button secondary type="primary" size="small" @click="editFollow(1)"
            v-if="followInfo.status !== undefined && followInfo.status == -1">
            添加到追番
          </n-button>
          <n-button secondary size="small" @click="editFollow(undefined, true)" v-if="followInfo.status != -1">
            取消追番
          </n-button>
        </div>
      </template>
    </n-list-item>
    <n-list-item>
      <i class="bi bi-bookmarks"></i> 标记为
      <template #suffix>
        <n-button-group size="small">
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
      <a :href="'https://bgm.tv/subject/' + anime.bgmId" target="_blank">
        <i class="bi bi-link-45deg"></i> 去番组计划查看本作品
      </a>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { ref } from 'vue';
import { lavaAnimeAPIs } from '../common/api';

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
    } catch (error) { }
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