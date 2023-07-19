<template>
  <MyBasicCard class="sm:px-6 py-4 rounded-md">
    <n-thing class="mb-4">
      <template #header> 观看历史 </template>
      <!-- TODO -->
      <!-- <template #header-extra>
        <n-button round text icon-placement="right">
          <template #icon>
            <n-icon> <ChevronRightFilled /> </n-icon>
          </template>
          查看全部
        </n-button>
      </template> -->
    </n-thing>
    <div class="relative">
      <div class="flex gap-2 overflow-x-scroll" ref="scroll" v-if="data.length">
        <HistoryRecord v-for="history in data" :record="history" />
      </div>
      <!-- 翻页按钮 -->
      <TransitionGroup name="fade" v-if="data.length">
        <ScrollButton
          v-if="!arrivedState.left"
          class="absolute -left-4 inset-y-0 grid place-items-center"
          direction="left"
          @click="() => scrollAction('left')"
        />
        <ScrollButton
          v-if="!arrivedState.right"
          class="absolute -right-4 inset-y-0 grid place-items-center"
          direction="right"
          @click="() => scrollAction('right')"
        />
      </TransitionGroup>
      <n-empty v-if="!data.length" description="什么也没有看过"></n-empty>
    </div>
  </MyBasicCard>
</template>

<script setup>
import { ref } from "vue";
import { LavaAnimeAPI } from "../../../common/api";
import HistoryRecord from "./HistoryRecord.vue";
import { useScroll } from "@vueuse/core";
import ScrollButton from "./ScrollButton.vue";
import { ChevronRightFilled } from "@vicons/material";

const data = ref([]);
const scroll = ref(null);

const { x, arrivedState } = useScroll(scroll, { behavior: "smooth" });
const scrollAction = (direction) => {
  if (direction == "right") {
    x.value = x.value + window.innerWidth * (5 / 7);
  } else if (direction == "left") {
    x.value = x.value - window.innerWidth * (5 / 7);
  }
};

async function getHistory(page, pageSize) {
  try {
    let request = await LavaAnimeAPI.post("/v2/anime/history/my", {
      page,
      pageSize,
      withAnimeData: true,
      latestOnly: true,
    });

    if (request.data.code == 200) {
      data.value = request.data.data;
    }
  } catch (error) {}
}

getHistory();
</script>
