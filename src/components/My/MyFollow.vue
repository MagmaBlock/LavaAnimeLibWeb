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
      <n-tabs type="segment" v-model:value="seletedTab" :default-value="2" ref="tabsRef" class="max-w-sm my-2">
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
import AnimeCardContainer from '../Layout/CardContainer/AnimeCardContainer.vue';

// 计算每页的尺寸, 以此让分页在所有尺寸的设备上都是刚好满行
let pageSize = 6 * 3 // 六行, 每行三个
function calPageSize() {
  let width = window.innerWidth
  if (width >= 640) pageSize = 5 * 4 // 五行, 每行四个
  if (width >= 768) pageSize = 4 * 5 // 四行, 每行五个
  if (width >= 1024) pageSize = 3 * 7 // 三行, 每行七个
  if (width >= 1280) pageSize = 3 * 8 // 三行, 每行八个
  if (width >= 1536) pageSize = 2 * 10 // 二行, 每行十个
}
calPageSize()

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
  return Math.ceil(followTotals.value[seletedTab.value] / pageSize)
})
watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) getFollow(seletedTab.value, newPage)
})

const loading = ref(false)

// 番剧相关数据
const thisFollowList = ref([])
const animeList = ref([])
const fetchFailed = ref(false)

async function getFollow(status, page = 1) {
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
  setTimeout(() => {
    loading.value = false
  }, 300)
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