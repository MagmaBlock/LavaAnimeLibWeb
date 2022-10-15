<template>
  <div>
    <div class="text-lg font-medium">赞助致谢</div>
    <div class="grid place-content-center z-0">
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-4">
        <template v-for="sponsor in sponsors">
          <SponsorCard :sponsor="sponsor" @click="sponsor.showModal = true" />

          <n-modal v-model:show="sponsor.showModal">
            <n-card class="w-80 dark:bg-zinc-800 dark:text-white" :title="sponsor.name" :bordered="false" role="dialog">
              <template #header-extra>
                <div class="dark:text-zinc-100">
                  {{ sponsor.support }}
                </div>
              </template>
              <div class="text-center">
                <div class="mb-4">
                  {{ sponsor.message || '没有留言'}}
                </div>
                <a v-if="sponsor.link" class="text-blue-500 font-bold" :href="sponsor.link" target="_blank">查看附加的链接</a>
              </div>
            </n-card>
          </n-modal>

        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import SponsorCard from './SponsorCard.vue';
export default {
  data() {
    return {
      sponsors: [],
      sponsorsRaw: [
        { name: "Longtianmu", support: "￥240", link: "https://ltm.ink/" },
        { name: "Arthals", support: "￥100.00", link: "https://arthals.ink/" },
        { name: "czy0729", support: "￥99.99", link: "https://github.com/czy0729" },
        { name: "小林", support: "￥100.00" },
        { name: "若葉", support: "其他", message: "提供新域名等支持", link: "https://loliloli.moe/" },
        { name: "XJH_Jorhai", support: "￥35.00", message: "麦老师是我的神明呜呜呜" },
        { name: "Arthals", support: "其他", message: "提供了数月的下载节点支持", link: "https://arthals.ink/" },
        { name: "Loliy", support: "￥13.00", message: "喝快乐水" }
      ]
    };
  },
  mounted() {
    let model = { name: '', support: '', link: '', message: '' } // 兜底模板防 undefined
    this.sponsorsRaw.forEach(sponsor => {
      this.sponsors.push({ ...model, ...sponsor, showModal: ref(false) })
    })
  },
  components: { SponsorCard }
}

</script>