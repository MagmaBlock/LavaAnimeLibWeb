<template>
  <MyBasicCard class="sm:px-6 py-4 rounded-md" v-if="myAnimes.length">
    <div class="text-lg">我的收藏 (旧版)</div>
    <div class="text-sm text-gray-500 mb-2"></div>
    <n-alert title="迁移提示" type="info" class="mb-2">
      番剧库新增「追番」功能，基于您的账号保存追番，多设备同时可用。<br>
      当前「我的收藏」不再维护，建议您将此浏览器中的收藏番剧一键迁移到当前账号的追番。<br><br>
      <n-button strong secondary size="small" @click="switchToMyFollow">
        一键将此浏览器中的收藏转移到「我的追番」
      </n-button>
    </n-alert>
    <AnimeCardContainer :animes="myAnimes" size="full" />
  </MyBasicCard>
</template>

<script>
import { getAnimesData, lavaAnimeAPIs } from '../../common/api.js';
import { getMyCollections } from '../../common/Methods/MyCollections.js';
import AnimeCardContainer from '../Container/AnimeCardContainer.vue';
import MyBasicCard from './MyBasicCard.vue';

export default {
  data() {
    return {
      myAnimes: []
    }
  },
  methods: {
    async switchToMyFollow() {
      for (let i in this.myAnimes) {
        let anime = this.myAnimes[i]
        try {
          let result = await lavaAnimeAPIs.editAnimeFollowAPI(anime.id, 1)
          if (result.data.code == 200) {
            console.log(anime.id, "迁移成功");
          } else {
            return $message.error(`迁移 (${i}/${this.myAnimes.length}) 失败, 其他意外错误`)
          }
        } catch (error) {
          return $message.error(`迁移 (${i}/${this.myAnimes.length}) 失败, 疑似网络故障`)
        }
      }
      $message.success(`迁移 ${this.myAnimes.length} 个番剧成功!`)
      localStorage.removeItem('myCollections')
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
  },
  async mounted() {
    let animes = getMyCollections();
    let animesData = await getAnimesData(animes);
    this.myAnimes = animesData.data;
  },
  components: { AnimeCardContainer, MyBasicCard }
}
</script>