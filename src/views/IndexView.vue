<script>
import axios from 'axios'
import config from '../common/config';
import { LavaAnimeAPI } from '../common/api'

import AnimeCard from '../components/AnimeCard.vue';
import Container from '../components/Container.vue';
import FullScreenAnimeCardContainer from '../components/Container/FullScreenAnimeCardContainer.vue';

export default {
  props: ["memory"],
  data() {
    return {
      tabs: { year: [], type: [] },
      animes: null,
      loading: {
        year: true,
        type: true,
      },
      justOpen: true
    };
  },
  methods: {
    async getIndex() {
      let index = (await LavaAnimeAPI("/v2/index/info")).data;
      if (index.code == 200)
        index = index.data;
      else
        throw new Error("索引获取失败");
      this.tabs = index;
      this.loading.year = false; // 动画
      this.loading.type = false;
    },
    async onTagClick(tagName, type) {
      if (this.memory.selectedTab[type] == tagName) { // 点击的标签已经被选择
        if (this.isMemoryJustToBeEmpty())
          return; // 当筛选条件已剩最后一个，禁止继续取消
        else
          this.memory.selectedTab[type] = ""; // 取消当前筛选条件
      }
      else { // 点击的标签未被选择
        this.memory.selectedTab[type] = tagName; // 将其选择
      }
      await this.queryIndex();
    },
    async queryIndex() {
      this.animes = null; // 移除数据，进入空状态
      let animeList = (await LavaAnimeAPI.post("/v2/index/query", this.memory.selectedTab)).data.data;
      await new Promise(resolve => { setTimeout(() => { resolve(); }, 200); }); // 慢一点切换以便展示动画
      this.animes = animeList; // 更新列表，同时解除空状态
    },
    isMemoryJustToBeEmpty() {
      let selectedTab = this.memory.selectedTab; // 当前所有被选中的条件
      let trueKeys = 0; // 仍然激活的条件类型
      for (let i in selectedTab) {
        if (selectedTab[i])
          trueKeys++; // 发现一个被激活的条件类型
      }
      if (trueKeys >= 2)
        return false; // 如果两个及以上被选中，允许取消
      else
        return true; // 如果只剩一个被选中，禁止取消
    }
  },
  async mounted() {
    this.getIndex();
    this.queryIndex();
  },
}
</script>

<template>
  <Container>
    <div class="lg:flex lg:flex-row">

      <!-- 选项部分，在高宽度屏幕上将左右 Flex -->
      <div class="lg:basis-1/4 select-none">

        <div class="sticky top-5">

          <div class="text-lg mb-4 mx-0.5 font-medium">番剧索引</div>
          <!-- 年份部分 -->
          <n-spin :show="loading.year" class="mb-2">
            <!-- 年份骨架屏 -->
            <div class="leading-none" v-if="loading.year">
              <div class="inline-block w-[60px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 17"></div>
            </div>
            <!-- 年份内容 -->
            <n-tag v-if="!loading.year" v-for="yearName in tabs.year" @click="onTagClick(yearName, 'year')"
              :checked="memory.selectedTab.year == yearName" style="margin: 2px;" checkable>
              {{ yearName }}
            </n-tag>
          </n-spin>
          <n-divider class="hidden lg:block" />
          <!-- 分类部分 -->
          <n-spin :show="loading.type">
            <!-- 分类骨架屏 -->
            <div class="leading-none" v-if="loading.type">
              <div class="inline-block w-[50px] h-7 bg-gray-300 m-0.5 animate-pulse" v-for="a in 4"></div>
            </div>
            <!-- 分类内容 -->
            <n-tag v-if="!loading.type" v-for="typeName in tabs.type" @click="onTagClick(typeName, 'type')"
              :checked="memory.selectedTab.type == typeName" style="margin: 2px;" checkable>
              {{ typeName }}
            </n-tag>
          </n-spin>
          <n-divider class="lg:hidden" />
        </div>
      </div>


      <!-- 番剧栅格部分 -->
      <FullScreenAnimeCardContainer :animes="this.animes" class="lg:basis-3/4 lg:ml-4"></FullScreenAnimeCardContainer>
    </div>
  </Container>
</template>


<style>
</style>