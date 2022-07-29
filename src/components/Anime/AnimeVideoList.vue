<script>
import axios from 'axios';
import config from '../../assets/config';

export default {
  props: ['laid'],
  data() {
    return {
      videoList: []
    };
  },
  methods: {
    async getVideoList() {
      let result = (await axios(config.api.lavaAnime + '/v1/anime/list/' + this.laid)).data
      if (result.code != 200) throw Error('番剧 LaID 错误')
      this.videoList = result.data
      console.log(this.videoList);
    }
  },
  mounted() {
    this.getVideoList()
  }
};
</script>

<template>
  <div class="ease-in duration-200
      shadow hover:shadow-lg
      w-full h-fit rounded-md
      bg-white opacity-90">
    <div v-for="video in videoList" class="ease-in duration-200
        border-b last:border-0 rounded-md
        hover:bg-gray-200
        py-2 px-4">
      <span v-for="group in video.tagedName.groupNames">
        <n-tag size="small" :bordered="false" type="info" class="mr-1">
          {{ group }}
        </n-tag>
        
      </span>
    </div>
  </div>
</template>
