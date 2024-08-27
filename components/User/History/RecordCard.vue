<template>
  <RouterLink
    :to="{
      name: 'anime-la',
      params: { la: animeId },
      query: { episode: episodeDisplay ?? undefined },
    }"
  >
    <div
      class="grid grid-cols-7 gap-x-3 w-80 select-none rounded-md cursor-pointer transition-transform active:scale-95"
    >
      <div class="col-span-3">
        <div class="relative w-full rounded-md overflow-hidden">
          <div class="aspect-w-16 aspect-h-10">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="absolute object-cover"
              alt="记录封面"
            />
            <div
              v-else
              class="absolute w-full h-full bg-zinc-200 dark:bg-zinc-800"
            ></div>
          </div>
          <div
            v-if="currentTime && totalTime"
            class="absolute inset-x-0 bottom-0 h-8 break-all bg-gradient-to-b from-transparent to-black/75 text-white px-4"
          >
            <!-- 观看进度条 -->
            <div class="absolute inset-x-0 bottom-2 px-1.5">
              <div class="relative">
                <div class="text-xs font-semibold mb-0.5 w-full text-right">
                  {{ getMins(currentTime) }} / {{ getMins(totalTime) }}
                </div>
                <div
                  class="absolute bg-white/90 rounded h-[3px]"
                  :style="{ width: getPercent + '%' }"
                ></div>
                <div
                  class="absolute bg-white/40 rounded h-[3px] w-[100%]"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- right -->
      <div class="col-span-4 flex flex-col">
        <div class="truncate">
          {{ name }}
        </div>
        <!-- Flex 空白占位 -->
        <div class="flex-1"></div>
        <div class="text-xs opacity-80">
          <div>
            {{
              episodeDisplay
                ? `看到${
                    episodeType !== "Normal" ? episodeType : ""
                  }第 ${episodeDisplay} 话`
                : "看到"
            }}
            <span v-if="currentTime && totalTime"> {{ getPercent }}% </span>
          </div>
          <div v-if="watchMethod && watchMethod !== 'web'">
            通过 {{ watchMethod }}
          </div>
          <div>{{ getTimeInfo }}</div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import moment from "moment";
import "moment/dist/locale/zh-cn";

interface Props {
  animeId?: number;
  imageUrl?: string | null;
  name: string;
  episodeType?: "Normal" | "SP" | "OP" | "ED" | "Other" | null;
  episodeDisplay?: number | null;
  currentTime?: number | null;
  totalTime?: number | null;
  watchMethod?: string | null;
  updatedAt: Date;
}

const props = defineProps<Props>();

const getPercent = computed(() => {
  if (!props.currentTime || !props.totalTime) return null;
  return Math.round((props.currentTime / props.totalTime) * 100);
});

const getMins = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  const pad = (number: number): string => {
    return number.toString().padStart(2, "0");
  };
  return `${pad(min)}:${pad(sec)}`;
};

const getTimeInfo = computed(() => {
  return moment(props.updatedAt).locale("zh-cn").calendar();
});
</script>
