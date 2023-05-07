<template>
  <div
    class="mb-4 px-2 py-1 mx-6 sm:mx-0 bg-gray-100 hover:bg-gray-200 rounded-md transition-all ease-in duration-100 cursor-pointer"
    @click="noticeModel = true"
  >
    <i class="bi bi-volume-down-fill"></i>
    <div class="inline">LavaAnimeLib 2022年10月秋季新番收录投票</div>
  </div>
  <n-modal v-model:show="noticeModel" class="bg-white h-screen">
    <n-card
      class="max-w-5xl"
      title="公告详情"
      :bordered="false"
      size="small"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <a
          class="bg-gray-200 text-xs text-gray-600 px-2 py-1 w-fit rounded"
          href="https://wj.qq.com/s2/10826706/f596/"
          target="_blank"
        >
          <i class="bi bi-box-arrow-up-right"></i>
          <span> 无法查看?</span>
        </a>
        <i
          class="bi bi-x-lg hover:text-blue-600 cursor-pointer ml-2"
          @click="noticeModel = false"
        ></i>
      </template>
      <iframe
        class="w-full h-full"
        src="https://wj.qq.com/s2/10826706/f596/"
        frameborder="0"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-modals allow-downloads allow-forms allow-popups"
      ></iframe>
    </n-card>
  </n-modal>
</template>

<script>
import { ref } from "vue";

export default {
  data() {
    return {
      noticeModel: ref(false),
    };
  },
};
</script>
