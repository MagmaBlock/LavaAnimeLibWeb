<script>
import axios from 'axios'
import { LavaAnimeAPI } from '../../common/api';
import config from '../../common/config'
import AnimeDataCard from '../../components/Anime/AnimeDataCard.vue';
import AnimeDataCardFake from '../../components/Anime/AnimeDataCardFake.vue';
import AnimeBackground from '../../components/Anime/AnimeBackground.vue'
import AnimePageRight from '../../components/Anime/AnimePageRight.vue';

export default {
  data() {
    return {
      laID: parseInt(this.$route.params.la),
      laData: {},
      videoList: [], // 拿回的原始数据列表
      epVideoList: {}, // 分集的数据列表
      selectedVideoList: '', // 当前选择的列表
      loading: true,
    };
  },
  async mounted() {
    await this.getLavaAnimeApi(this.laID);
    await this.getVideoList(this.laID);
    this.splitVideoList(this.videoList);
    this.loading = false;
  },
  methods: {
    async getLavaAnimeApi(laID) {
      let result = (await LavaAnimeAPI.get("/v2/anime/get", { params: { id: laID, full: true } })).data;
      console.log(`Got LavaAnimeApi data of la${this.laID}:`, result);
      if (result.code != 200)
        return;
      this.laData = result.data;
    },
    async getVideoList(laID) {
      let result = (await LavaAnimeAPI.get("/v2/anime/file", { params: { id: laID } })).data;
      console.log(`Got VideoList of la${this.laID}:`, result);
      if (result.code != 200)
        throw Error("番剧 LaID 错误");
      this.videoList = result.data;
      this.selectedVideoList = 'all'
    },
    splitVideoList(videoList) {
      for (let i in videoList) {
        if (videoList[i].episode) {
          if (!this.epVideoList[videoList[i].episode]) this.epVideoList[videoList[i].episode] = new Array()
          this.epVideoList[videoList[i].episode].push(videoList[i]);
        }
      }
    }
  }
}
</script>

<template>
  <Container>
    <div class="lg:flex lg:flex-row w-full">
      <div class="lg:basis-1/3 lg:mr-10">
        <AnimeDataCardFake v-if="loading" class="mb-2" />
        <AnimeDataCard v-if="!loading" :la="laData" class="mb-2" />
      </div>
      <div class="lg:basis-2/3">
        <AnimePageRight :father="this" v-if="!loading"></AnimePageRight>
      </div>
    </div>
    <AnimeBackground v-if="!loading" :la="laData"></AnimeBackground>
  </Container>
</template>