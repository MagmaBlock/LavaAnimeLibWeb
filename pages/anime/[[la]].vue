<template>
  <ContainerPageMobileFull>
    <DevOnly>
      <AnimeDevTool class="mb-0 lg:mb-4" />
    </DevOnly>
    <div
      class="grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-4 items-start"
      v-if="store.animeId"
    >
      <div class="col-span-1 lg:col-span-2 flex flex-col gap-0 md:gap-4">
        <AnimePlayerVideoPlayer />
        <div>
          <AnimeMetaCard v-if="breakpoint.greaterOrEqual('md').value" />
          <AnimeMetaCardMini v-else />
        </div>
      </div>
      <div class="col-span-1 lg:col-span-1 flex flex-col gap-0 md:gap-4">
        <AnimeEpisodeCard />
        <AnimeEpisodeDetails
          v-if="store.activeEpisodeId"
          :key="store.activeEpisodeId"
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0 }"
          :duration="300"
          :episode-id="store.activeEpisodeId"
        />
        <AnimeOtherFileCard />
      </div>
    </div>
    <NResult
      v-else
      class="my-16"
      status="404"
      title="动画不存在"
      description="无法找到该动画，请检查动画ID是否正确"
    />
  </ContainerPageMobileFull>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { z } from "zod";

const route = useRoute();
const store = useAnimeStore();
const breakpoint = useBreakpoints(breakpointsTailwind);

onMounted(() => {
  const maybeAnimeId = z
    .number()
    .int()
    .gt(0)
    .safeParse(Number(route.params.la));
  if (maybeAnimeId.success) {
    store.animeId = maybeAnimeId.data;
  }
});
</script>
