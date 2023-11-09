<template>
  <NCard title="近期更新" embedded :bordered="false">
    <NSpace>
      <div v-for="record in data" class="flex">
        <AnimeCard :anime="record.anime" class="w-24" />
        <AnimeFileInfo
          :video="{ parseResult: record.parseResult, type: 'file' }"
          class="w-64"
        />
      </div>
    </NSpace>
  </NCard>
</template>

<script setup>
const data = ref([]);

try {
  let result = await LavaAnimeAPI.get("/v2/anime/recent-update/get");
  if (result.data.code === 200) {
    data.value = result.data.data;
  }
} catch (error) {}

console.log(data.value);

// interface RecentUpdate {
//   id: number;
//   animeID: number;
//   bangumiID: number;
//   fileName: string;
//   index: string;
//   messageSentStatus: boolean;
//   uploadTime: string;
//   parseResult: {
//     animeTitle: string | null,
//     animeYear: string | null,
//     episode: string | null,
//     extensionName: string | null,
//     fileName: string,
//     groups: {
//       result?: string,
//       raw: string,
//       type: "group",
//     }[],
//     noBrowser: boolean,
//     otherInfo: {
//       result?: string,
//       raw: string,
//       type: string,
//     }[],
//     tagedName:
//       | {
//           result?: string,
//           raw: string,
//           type: string,
//         }[]
//       | string,
//     videoQuality: {
//       result: string,
//       raw: string,
//       type: "quality",
//     }[],
//     videoSource: {
//       result: string,
//       raw: string,
//       type: "source",
//     }[],
//     videoSubtitle: {
//       result: string,
//       raw: string,
//       type: "subtitle",
//     }[],
//   };
// }
</script>

<style></style>
