<template>
  <MyBasicCard class="sm:px-6 py-4 rounded-md">
    <div class="mb-2">
      <n-thing>
        <template #header>
          我的追番
        </template>
        <template #header-extra>
          <n-button circle size="small" @click="refresh">
            <i class="bi bi-arrow-clockwise"></i>
          </n-button>
        </template>
      </n-thing>
      <n-tabs type="line" v-model:value="seletedTab" :default-value="2" ref="tabsRef">
        <n-tab :name="0">想看<span class="ml-1" v-if="followTotals['0']">({{ followTotals["0"] }})</span></n-tab>
        <n-tab :name="1">在看<span class="ml-1" v-if="followTotals['1']">({{ followTotals["1"] }})</span></n-tab>
        <n-tab :name="2">看过<span class="ml-1" v-if="followTotals['2']">({{ followTotals["2"] }})</span></n-tab>
      </n-tabs>
    </div>
    <AnimeCardContainer v-if="!fetchFailed" :animes="animeList" size="full" :loading="loading" />
    <n-result v-else class="my-8" status="404" title="获取失败" description="未能连接到人类所在的世界..."></n-result>
    <n-pagination v-if="totalPages > 1" v-model:page="page" :page-count="totalPages" class="mt-4" />
  </MyBasicCard>
</template>

<script setup>
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import { lavaAnimeAPIs } from '../../common/api';
import AnimeCardContainer from '../Container/AnimeCardContainer.vue';

// StatusTab、分页相关数据
const tabsRef = ref(null)
const seletedTab = ref(1)
const followTotals = ref({})
watch(seletedTab, newTab => {
  page.value = 1
  getFollow(newTab, page.value)
})

const page = ref(1)
const totalPages = computed(() => {
  return Math.ceil(followTotals.value[seletedTab.value] / 20)
})
watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) getFollow(seletedTab.value, newPage)
})

const loading = ref(false)

// 番剧相关数据
const thisFollowList = ref([])
const animeList = ref([])
const fetchFailed = ref(false)

async function getFollow(status, page = 1, pageSize = 20) {
  loading.value = true
  try {
    let result = await lavaAnimeAPIs.getAnimeFollowListAPI([status], page, pageSize)
    if (result.data.code = 200) {
      thisFollowList.value = result.data.data
    }
    if (Array.isArray(thisFollowList.value) && thisFollowList.value.length) {
      animeList.value = thisFollowList.value.map(follow => {
        return follow.anime
      })
    } else {
      animeList.value = []
    }
  } catch (error) {
    fetchFailed.value = true
  }
  loading.value = false
}

async function getFollowTotal() {
  try {
    let result = await lavaAnimeAPIs.getAnimeFollowTotalAPI()
    if (result.data.code = 200) {
      followTotals.value = result.data.data
    }
    nextTick(() => tabsRef.value?.syncBarPosition()) // 更新滚动条的位置
  } catch (error) { }
}

async function refresh() {
  getFollowTotal()
  getFollow(seletedTab.value, page.value)
  $message.success("已刷新!")
}

onMounted(() => {
  getFollowTotal()
  getFollow(seletedTab.value, page.value)
})
</script>