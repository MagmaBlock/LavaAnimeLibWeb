<script>
import axios from 'axios'
import { LavaAnimeAPI } from '../../common/api';
import config from '../../common/config'
import AnimeDataCard from '../../components/Anime/AnimeDataCard.vue';
import AnimeDataCardFake from '../../components/Anime/AnimeDataCardFake.vue';
import AnimeBackground from '../../components/Anime/AnimeBackground.vue'
import AnimeFileList from '../../components/Anime/AnimeFileList.vue';
import ContainerMobileFull from '../../components/ContainerMobileFull.vue';
import VideoPlayer from '../../components/Anime/VideoPlayer.vue';
import RelationAnimes from '../../components/Anime/RelationAnimes.vue';
import UseLocalVideoPlayer from '../../components/Anime/UseLocalVideoPlayer.vue';

export default {
  data() {
    return {
      laID: parseInt(this.$route.params.la),
      laData: {},
      videoList: [],
      epVideoList: {},
      selectedVideoList: '',
      selectedVideo: {},
      loading: true,
    };
  },
  async mounted() {
    await this.getLavaAnimeApi(this.laID);
    await this.getVideoList(this.laID);
    this.splitVideoList(this.videoList);
    this.loading = false;
  },
  watch: {
    selectedVideo(newVideo, oldVideo) {
      console.log(newVideo, oldVideo);
    }
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
      this.selectedVideoList = "all";
    },
    splitVideoList(videoList) {
      for (let i in videoList) {
        if (videoList[i].episode) {
          if (!this.epVideoList[videoList[i].episode])
            this.epVideoList[videoList[i].episode] = new Array();
          this.epVideoList[videoList[i].episode].push(videoList[i]);
        }
      }
    },
    async reportNewView(id, ep, file) {
      let result = (await LavaAnimeAPI.post('/v2/anime/view/add', {
        id, ep, file
      }).data)
      if (result.code == 200) {
        console.log('上报播放量成功: ', result);
      }
    }
  },
  components: { VideoPlayer, RelationAnimes, UseLocalVideoPlayer }
}
</script>

<template>
  <ContainerMobileFull>
    <!-- Flex 布局，仅在 lg 以上可用 -->
    <div class="lg:flex lg:flex-row lg:gap-4 lg:px-12 w-full">
      <div class="lg:basis-2/3">
        <!-- video -->
        <VideoPlayer class="sm:relative sm:mb-4" :url="selectedVideo.url || ''" ref="VideoPlayer"></VideoPlayer>
        <UseLocalVideoPlayer class="sm:mb-4" :video="selectedVideo" :player="this.$refs.VideoPlayer">
        </UseLocalVideoPlayer>
        <!-- 番剧卡，仅在 sm 以上显示 -->
        <AnimeDataCard v-if="!loading" :la="laData" class="hidden sm:block sm:mb-4" />
        <AnimeDataCardFake v-if="loading" class="hidden sm:block sm:mb-4" />
      </div>
      <div class="lg:basis-1/3">
        <!-- 文件和集数列表 -->
        <AnimeFileList :father="this" v-if="!loading" class="sm:mb-4"></AnimeFileList>
        <!-- 关联作品 -->
        <RelationAnimes v-if="!loading" :la="laData"></RelationAnimes>
        <!-- 番剧卡，仅在手机端显示 -->
        <AnimeDataCard v-if="!loading" :la="laData" class="sm:hidden" />
        <AnimeDataCardFake v-if="loading" class="sm:hidden" />
      </div>
    </div>
    <AnimeBackground v-if="!loading" :la="laData"></AnimeBackground>
  </ContainerMobileFull>
</template>