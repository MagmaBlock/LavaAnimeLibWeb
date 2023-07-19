<template>
  <div>
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
                :src="record?.animeData.images.poster"
                class="absolute object-cover"
                alt="记录封面"
              />
            </div>
            <div
              class="absolute inset-x-0 bottom-0 h-6 break-all bg-gradient-to-b from-transparent to-black/75 text-white px-4"
              v-if="getPercent"
            >
              <!-- 观看进度条 -->
              <div class="absolute inset-x-0 bottom-2 px-1.5">
                <div class="relative">
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
  </div>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const { record } = defineProps({
  record: {
    type: Object,
  },
});

const getPercent = computed(() => {
  if (!record.currentTime || !record.totalTime) return null;
  return Math.round((record.currentTime / record.totalTime) * 100);
});

const getTimeInfo = computed(() => {
  const time = dayjs(record.lastReportTime);

  return time.calendar();
});
</script>
