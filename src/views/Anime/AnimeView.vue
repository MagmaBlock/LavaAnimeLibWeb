<script>
import { LavaAnimeAPI } from '../../common/api';
import ContainerMobileFull from '../../components/ContainerMobileFull.vue';
import VideoPlayer from '../../components/Anime/VideoPlayer.vue';
import LocalPlayers from '../../components/Anime/LocalPlayer/LocalPlayers.vue';
import LocalPlayerIcons from '../../components/Anime/LocalPlayer/LocalPlayerIcons.vue';
import AnimeDataCard from '../../components/Anime/AnimeDataCard.vue';
import AnimeDataCardFake from '../../components/Anime/AnimeDataCardFake.vue';
import RelationAnimes from '../../components/Anime/RelationAnimes.vue';
import AnimeBackground from '../../components/Anime/AnimeBackground.vue';
import AnimeBasicCard from '../../components/Anime/AnimeBasicCard.vue';
import AnimeFileView from './AnimeFileView.vue';

export default {
  data() {
    return {
      laID: parseInt(this.$route.params.la),
      laData: {}, // 界面完整资料数据
      selectedFile: {}, // 当前文件信息
      saveTime: false,
      viewTimes: 0, // 上报的播放次数
      error: false, // 发生错误后，会变为 true
      errorCode: Number, // 错误码
      loading: true
    };
  },
  provide() {
    return {
      reportNewView: this.reportNewView, changePlayingFile: this.changePlayingFile
    }
  },
  async mounted() {
    document.title = '播放 | 熔岩番剧库 LavaAnimeLib';
    // 获取 LavaAnimeLib 数据 API
    await this.getLavaAnimeApi(this.laID);
    if (!this.error) document.title = `${this.laData.title} | 熔岩番剧库 LavaAnimeLib`
    this.loading = false;
    window.scrollTo({
      top: 0, left: 0, behavior: "smooth" //平滑滚动
    });
  },
  methods: {
    async getLavaAnimeApi(laID) {
      try {
        let result = await LavaAnimeAPI.get("/v2/anime/get", { params: { id: laID, full: true } });
        console.log(`Got LavaAnimeApi data of la${this.laID}:`, result.data);
        this.laData = result.data.data;
      } catch (error) {
        console.log('获取信息时发生', error, '错误');
        this.error = true
        this.errorCode = error.response.status
        this.loading = false
        return
      }
    },
    async reportNewView(options) {
      if (this.viewTimes > 1) return; // 一次会话最大上报两回
      let _options = {
        id: this.laID, ep: this.selectedFile.episode,
        file: this.selectedFile.name, type: undefined,
        ...options
      }
      options = _options
      let result = (await LavaAnimeAPI.post("/v2/anime/view/add", options)).data;
      if (result.code == 200) {
        this.viewTimes++;
        console.log("上报播放量成功: ", result, 2 - this.viewTimes);
      }
    },
    changePlayingFile(file, saveTime = false) { // 提供给有能力切换视频的下层组件的工具函数
      console.log('视频更新: ', file, '\n保存时间轴: ', saveTime);
      if (!this.error) {
        if (file.episode) {
          document.title = `${this.laData.title} 第${file.episode}话 | 熔岩番剧库 LavaAnimeLib`
        }
        else {
          document.title = `${this.laData.title} | 熔岩番剧库 LavaAnimeLib`
        }
      }
      this.saveTime = saveTime
      this.selectedFile = file
    }
  },
  components: { ContainerMobileFull, VideoPlayer, LocalPlayers, AnimeDataCard, AnimeDataCardFake, RelationAnimes, AnimeBackground, AnimeBasicCard, LocalPlayerIcons, AnimeFileView }
}
</script>

<template>
  <ContainerMobileFull>
    <!-- 开发模式视图 -->
    <div class="lg:px-12" v-if="this.$route.query.dev">
      <AnimeBasicCard class="p-4 mb-4 flex">
        <div class="font-bold">开发模式</div>
        <div class="mx-4 grid place-items-center"> 当前 LavaAnimeID : {{ laID }} </div>
        <RouterLink class="border border-blue-600 text-blue-600 rounded-md px-2 mx-2" :to="`/anime/${laID - 1}?dev=1`">
          前一个
        </RouterLink>
        <RouterLink class="border border-blue-600 text-blue-600 rounded-md px-2 mx-2" :to="`/anime/${laID + 1}?dev=1`">
          后一个
        </RouterLink>
        <div class="mx-4 grid place-items-center">Loading: {{ loading }} | viewTimes: {{ viewTimes }}</div>
      </AnimeBasicCard>
    </div>
    <!-- 主视图，Flex 布局，仅在 lg 以上可用 -->
    <div class="lg:flex lg:flex-row lg:gap-6 lg:px-12 w-full" v-if="!error">
      <!-- 左 Flex -->
      <div class="lg:basis-2/3">
        <!-- 视频框 -->
        <VideoPlayer class="sm:relative sm:mb-4" ref="VideoPlayer" :video="selectedFile" :save-time="saveTime" />
        <!-- 本地播放器调用 -->
        <LocalPlayers class="sm:mb-4" :video="selectedFile" :player="this.$refs.VideoPlayer" />
        <!-- 番剧卡，仅在 sm 以上显示 -->
        <AnimeDataCard v-if="!loading" :la="laData" class="hidden sm:block sm:mb-4" />
        <AnimeDataCardFake v-if="loading" class="hidden sm:block sm:mb-4" />
      </div>
      <!-- 右 Flex -->
      <div class="lg:basis-1/3">
        <AnimeFileView :la-i-d="laID" :la-data="laData" :selected-file="selectedFile" />
        <!-- 关联作品 -->
        <RelationAnimes v-if="!loading" :la="laData" />
        <!-- 番剧卡，仅在手机端显示 -->
        <AnimeDataCard v-if="!loading" :la="laData" class="sm:hidden" />
        <AnimeDataCardFake v-if="loading" class="sm:hidden" />
      </div>
    </div>
    <!-- 错误处理视图 -->
    <div v-if="error && errorCode == 404" class="w-full grid place-content-center mt-16">
      <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬" class="bg-white/70 w-fit p-10 rounded" />
    </div>
    <AnimeBackground v-if="!loading" :la="laData" />
  </ContainerMobileFull>
</template>