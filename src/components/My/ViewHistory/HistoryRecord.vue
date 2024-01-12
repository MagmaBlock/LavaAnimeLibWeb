<template>
  <RouterLink
    :to="{
      name: 'Anime',
      params: { la: record.animeID },
      query: { episode: record.episode ?? undefined },
    }"
  >
    <div
      class="grid grid-cols-7 gap-x-3 w-80 select-none rounded-md cursor-pointer transition-transform active:scale-95"
    >
      <div class="col-span-3">
        <div class="relative w-full rounded-md overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <img
              v-if="record?.animeData?.images?.poster"
              v-lazy="{
                src: record?.animeData?.images?.poster,
                loading:
                  'https://bangumi-app-img.5t5.top/assets/PosterLoading.jpg',
                error: 'https://bangumi-app-img.5t5.top/assets/noposter.png',
              }"
              class="absolute object-cover"
              alt="记录封面"
            />
            <div
              v-else
              class="absolute w-full h-full bg-zinc-200 dark:bg-zinc-800"
            ></div>
          </div>
          <div
            class="absolute inset-x-0 bottom-0 h-8 break-all bg-gradient-to-b from-transparent to-black/75 text-white px-4"
            v-if="getPercent"
          >
            <!-- 观看进度条 -->
            <div class="absolute inset-x-0 bottom-2 px-1.5">
              <div class="relative">
                <div class="text-xs font-semibold mb-0.5 w-full text-right">
                  {{ getMins(record?.currentTime) }} /
                  {{ getMins(record?.totalTime) }}
                </div>
                <div
                  class="absolute bg-white/90 rounded-full h-[3px]"
                  :style="{ width: getPercent + '%' }"
                ></div>
                <div
                  class="absolute bg-white/40 rounded-full h-[3px] w-[100%]"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- right -->
      <div class="col-span-4 flex flex-col">
        <div class="truncate">
          {{ record?.animeData?.title }}
        </div>
        <!-- Flex 空白占位 -->
        <div class="flex-1"></div>
        <div class="text-xs opacity-80">
          <div>
            {{ record.episode ? `看到第 ${record.episode} 话` : "看到" }}
            <span v-if="record?.currentTime && record?.totalTime">
              {{ getPercent }}%
            </span>
          </div>
          <div v-if="record.watchMethod !== 'WebPlayer'">
            通过 {{ record.watchMethod }}
          </div>
          <div>{{ getTimeInfo }}</div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import moment from "moment";
import "moment/dist/locale/zh-cn";

const props = defineProps({
  record: {
    type: Object,
  },
});
const { record } = toRefs(props);

const getPercent = computed(() => {
  if (!record.value.currentTime || !record.value.totalTime) return null;
  return Math.round((record.value.currentTime / record.value.totalTime) * 100);
});

/**
 * 根据秒计算分秒
 * @param {Number} seconds
 * @returns {String}
 */
const getMins = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = ~~(seconds % 60);
  const pad = (number) => {
    return number.toString().padStart(2, "0");
  };
  return `${pad(min)}:${pad(sec)}`;
};

const getTimeInfo = computed(() => {
  return moment(record.value.lastReportTime).locale("zh-cn").calendar();
});
</script>
