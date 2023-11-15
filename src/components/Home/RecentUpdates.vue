<template>
  <NCard title="新番近期更新" embedded :bordered="false">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <!-- 每个更新卡片 -->
      <RouterLink
        v-for="record in data"
        :class="record.animeID ? '' : 'cursor-not-allowed'"
        :to="
          record.animeID
            ? {
                name: 'Anime',
                params: { la: record.animeID },
                query: { episode: record.parseResult?.episode },
              }
            : {}
        "
        class="grid grid-cols-3 place-items-start rounded overflow-hidden bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <div class="col-span-1 w-full h-full">
          <div class="aspect-w-2 aspect-h-3">
            <img
              v-if="record.anime?.images?.poster"
              :src="record.anime?.images?.poster"
              class="object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-zinc-200 dark:bg-zinc-800"
            ></div>
          </div>
        </div>
        <div class="col-span-2 w-full h-full px-3 py-1.5 relative">
          <!-- title -->
          <div class="text-base">
            <NEllipsis :line-clamp="2" v-if="record.anime">
              {{ record.anime.title }}
            </NEllipsis>
            <NEllipsis :line-clamp="2" v-else>
              {{ record.index?.split("/")?.[2] }}
            </NEllipsis>
          </div>
          <!-- time -->
          <div class="text-xs opacity-75">
            <span>{{ getTimeInfo(record.uploadTime) }}</span>
            <span class="mx-1.5 font-bold">·</span>
            <!-- index -->
            <span v-if="record.anime">
              {{ record.anime.index.year }}{{ record.anime.index.type }}
            </span>
            <span v-else>
              {{ record.index?.split("/")?.[0]
              }}{{ record.index?.split("/")?.[1] }}
            </span>
          </div>
          <!-- groups / episode -->
          <NSpace :size="4" class="my-2 absolute bottom-0">
            <NTag
              v-if="record.parseResult?.episode"
              size="small"
              type="primary"
              :bordered="false"
            >
              第 {{ record.parseResult?.episode }} 话
            </NTag>
            <NTag
              v-for="group in record.parseResult?.groups"
              size="small"
              :bordered="false"
            >
              {{ group.result }}
            </NTag>
          </NSpace>
        </div>
      </RouterLink>
    </div>
  </NCard>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import calendar from "dayjs/plugin/calendar";
import { LavaAnimeAPI } from "../../common/api.js";
dayjs.extend(calendar);

const data = ref([]);

onMounted(async () => {
  try {
    let result = await LavaAnimeAPI.get("/v2/anime/recent-update/get", {
      params: {
        take: 36,
      },
    });
    if (result.data.code === 200) {
      data.value = result.data.data;
    }
  } catch (error) {}

  console.log(data.value);
});

const getTimeInfo = (dateTime) => {
  const time = dayjs(dateTime);

  return time.calendar();
};
</script>
