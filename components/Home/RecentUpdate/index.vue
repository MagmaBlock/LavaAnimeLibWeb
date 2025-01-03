<template>
  <NCard title="近期更新" embedded :bordered="false">
    <template #header-extra>
      <NFlex class="cursor-pointer" @click="ignoreDuplicate = !ignoreDuplicate">
        <NSwitch :value="ignoreDuplicate" />
        忽略重复集数
      </NFlex>
    </template>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <!-- 每个更新卡片 -->
      <NuxtLink
        v-if="!loading"
        v-for="record in data"
        :class="record.animeID ? '' : 'cursor-not-allowed'"
        :to="
          record.animeID
            ? {
                name: 'anime-la',
                params: { la: record.animeID },
                query: { episode: record.parseResult?.episode },
              }
            : {}
        "
      >
        <NCard
          content-style="padding: 0px"
          class="overflow-hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 h-full"
        >
          <div class="grid grid-cols-3 h-full">
            <!-- 图片 -->
            <div
              v-if="record.anime?.images?.poster"
              class="col-span-1 w-full h-full"
            >
              <div class="aspect-w-2 aspect-h-3">
                <img
                  :src="record.anime?.images?.poster"
                  class="object-cover"
                  v-lazy
                />
              </div>
            </div>
            <!-- 右侧信息 -->
            <NFlex
              vertical
              justify="space-between"
              :class="
                record.anime?.images?.poster ? 'col-span-2' : 'col-span-3'
              "
              class="w-full h-full px-3 pt-1.5 pb-2"
            >
              <!-- title -->
              <div>
                <!-- 正常标题 -->
                <NEllipsis :line-clamp="1" v-if="record.anime">
                  {{ record.anime.title }}
                </NEllipsis>
                <!-- 无 anime 标题 (文件夹名) -->
                <NEllipsis :line-clamp="1" v-else>
                  {{ record.index?.split("/")?.[2] }}
                </NEllipsis>
              </div>

              <div>
                <!-- episode -->
                <div
                  v-if="record.parseResult?.episode"
                  class="flex place-items-center gap-1 text-xs opacity-75"
                >
                  <NIcon>
                    <Icon name="material-symbols:stack" />
                  </NIcon>
                  第 {{ record.parseResult?.episode }} 话
                </div>

                <!-- index -->
                <div class="flex place-items-center gap-1 text-xs opacity-75">
                  <Icon name="material-symbols:calendar-month" />
                  <div v-if="record.anime">
                    {{ record.anime.index.year }}{{ record.anime.index.type }}
                  </div>
                  <div v-else>
                    {{ record.index?.split("/")?.[0]
                    }}{{ record.index?.split("/")?.[1] }}
                  </div>
                </div>

                <!-- groups -->
                <div
                  v-if="record.parseResult?.groups?.length"
                  class="flex place-items-center gap-1 text-xs opacity-75"
                >
                  <NIcon>
                    <Icon name="material-symbols:group" />
                  </NIcon>
                  <div>
                    <template v-for="group in record.parseResult?.groups">
                      {{ group.result }}
                    </template>
                  </div>
                </div>

                <!-- time -->
                <div class="flex place-items-center gap-1 text-xs opacity-75">
                  <Icon name="material-symbols:schedule" />
                  <span>{{ getTimeInfo(record.uploadTime) }}</span>
                </div>
              </div>
            </NFlex>
          </div>
        </NCard>
      </NuxtLink>

      <NSkeleton v-if="loading" v-for="a in 20" class="aspect-w-2 aspect-h-1" />
    </div>
  </NCard>
</template>

<script setup>
import moment from "moment";
import "moment/dist/locale/zh-cn";

const message = useMessage();

const data = ref([]);
const ignoreDuplicate = ref(true);
const loading = ref(true);

const getTimeInfo = (dateTime) => {
  return moment(dateTime).locale("zh-cn").calendar();
};

getRecentUpdates();

watch(ignoreDuplicate, () => {
  getRecentUpdates();
});

async function getRecentUpdates() {
  loading.value = true;
  try {
    let result = await LavaAnimeAPI.get("/v2/anime/recent-update/get", {
      params: {
        take: 36,
        ignoreDuplicate: ignoreDuplicate.value,
      },
    });

    if (result.data.code === 200) {
      data.value = result.data.data;
    }
  } catch (error) {
    message.error("获取近期更新列表失败");
    console.error(error);
  }
  loading.value = false;
}
</script>

<style></style>
