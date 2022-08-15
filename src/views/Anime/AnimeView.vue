<script>
import axios from 'axios'
import config from '../../common/config'
import AnimeBackground from '../../components/Anime/AnimeBackground.vue'
import AnimeDataCardFake from '../../components/Anime/AnimeDataCardFake.vue';
import AnimeVideoList from '../../components/Anime/AnimeVideoList.vue';

export default {
  data() {
    return {
      laID: parseInt(this.$route.params.la),
      laData: {},
      bgmData: undefined,
      loading: true,
      noBgm: false
    };
  },
  async mounted() {
    await this.getLavaAnimeApi(this.laID);
    if (parseInt(this.laData.bgmid) == 0) this.noBgm = true;
    if (!this.noBgm) await this.getBangumiApi(this.laData.bgmid);
    this.loading = false;
  },
  methods: {
    async getLavaAnimeApi(laID) {
      let result = (await axios(config.api.lavaAnime + "/v1/anime/id/" + laID)).data;
      console.log(`Got LavaAnimeApi data of la${this.laID}:`, result);
      if (result.code != 0)
        return;
      this.laData = result.data;
    },
    async getBangumiApi(bgmID) {
      let result = (await axios(config.api.bangumi + "/v0/subjects/" + bgmID)).data;
      console.log(`Got BangumiApi data of bgm${bgmID}:`, result);
      this.bgmData = result;
    },
  },
}
</script>

<template>
  <container>
    <div class="lg:flex lg:flex-row w-full">
      <AnimeDataCardFake v-if="loading" class="lg:basis-1/3" />

      <AnimeDataCard v-if="!loading" :la="laData" :bgm="bgmData" class="mb-2 lg:basis-1/3 lg:mr-10" />
      <AnimeVideoList :laid="this.laID" class="lg:basis-2/3"></AnimeVideoList>
    </div>
    <AnimeBackground v-if="!loading" :la="laData"></AnimeBackground>
  </container>
</template>