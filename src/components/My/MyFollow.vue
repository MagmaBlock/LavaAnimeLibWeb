<template>
  <MyBasicCard class="sm:px-6 py-4 rounded-md">
    <div class="mb-2">
      <div class="text-lg mb-2">我的追番</div>
      <n-tabs type="line" v-model:value="seletedTab" :default-value="2" ref="tabsRef">
        <n-tab :name="0">想看<span class="ml-1" v-if="followTotals['0']">({{ followTotals["0"] }})</span></n-tab>
        <n-tab :name="1">在看<span class="ml-1" v-if="followTotals['1']">({{ followTotals["1"] }})</span></n-tab>
        <n-tab :name="2">看过<span class="ml-1" v-if="followTotals['2']">({{ followTotals["2"] }})</span></n-tab>
      </n-tabs>
    </div>
    <AnimeCardContainer :animes="animeList" size="full" />
    <n-result v-if="fetchFailed" class="my-4" status="404" title="获取失败" description="生活总归带点荒谬"></n-result>
  </MyBasicCard>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { lavaAnimeAPIs } from '../../common/api';
import AnimeCardContainer from '../Container/AnimeCardContainer.vue';

const tabsRef = ref(null)
const seletedTab = ref(1)
watch(seletedTab, newTab => getFollow(newTab))
const followTotals = ref({})

const thisFollowList = ref([])
const animeList = ref([])
const fetchFailed = ref(false)

const getFollow = async status => {
  try {
    let result = await lavaAnimeAPIs.getAnimeFollowListAPI([status])
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
}

async function getFollowTatals() {
  try {
    let result = await lavaAnimeAPIs.getAnimeFollowTotalAPI()
    if (result.data.code = 200) {
      followTotals.value = result.data.data
    }
    nextTick(() => tabsRef.value?.syncBarPosition()) // 更新滚动条的位置
  } catch (error) { }
}

onMounted(() => {
  getFollowTatals()
  getFollow(1)
})
</script>