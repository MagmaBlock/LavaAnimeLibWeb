<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints, useImage } from "@vueuse/core";

const props = defineProps<{
  id: number;
  name: string;
  image?: string;
  views?: number;
  bdrip?: boolean;
  nsfw?: boolean;
  releaseYear?: number;
  releaseSeason?: string;
  relation?: string; // 关联作品
}>();

const showMenu = ref(false);

const handleMenu = (event: MouseEvent) => {
  event.preventDefault();
  showMenu.value = !showMenu.value;
};

const posterUrl = computed(
  () => props.image || "https://bangumi-app-img.5t5.top/assets/noposter.png"
);

const { isReady, error } = useImage({ src: posterUrl.value });

const viewDisplay = computed(() => {
  if (!props.views) return "0";
  const views = props.views;
  return views > 9999 ? `${(views / 10000).toFixed(2)}万` : views.toString();
});

const isWide = useBreakpoints(breakpointsTailwind).greater("md");
</script>

<template>
  <!-- 卡片 -->
  <div
    class="relative box-content overflow-hidden select-none rounded-md transition ease-out border-2 border-white/0 hover:border-2 hover:border-blue-600 hover:lg:brightness-90"
    @contextmenu="handleMenu"
  >
    <div class="absolute h-full w-full bg-gray-200 dark:bg-zinc-700"></div>

    <!-- 上半：海报 + 标题 -->
    <div class="relative cursor-pointer overflow-hidden">
      <NuxtLink :to="{ name: 'anime-la', params: { la: id } }">
        <!-- 图片容器 -->
        <div class="aspect-w-2 aspect-h-3 overflow-hidden">
          <img
            v-if="isReady && !error"
            :src="posterUrl"
            class="absolute object-cover"
            alt="封面图片"
          />
        </div>
        <!-- 标题 -->
        <div
          class="absolute inset-x-0 bottom-0 grid h-24 items-end break-all bg-gradient-to-b from-transparent to-black/75 px-3 py-3 text-[13px] text-white font-semibold"
        >
          <NEllipsis :line-clamp="2">
            {{ name || "..." }}
            <!-- Special Tags -->
            <div
              v-if="bdrip"
              class="ml-0.5 inline-block rounded px-1.5 text-xs font-medium bg-blue-400 bg-opacity-50 backdrop-blur-sm"
            >
              BD
            </div>
            <div
              v-if="nsfw"
              class="ml-0.5 inline-block rounded px-1.5 text-xs font-medium bg-yellow-300 bg-opacity-50 backdrop-blur-sm"
            >
              NSFW
            </div>
          </NEllipsis>
        </div>
        <!-- 额外 Tag -->
        <span
          class="absolute top-1 right-1 bg-blue-600 backdrop-blur bg-opacity-60 text-white text-xs font-semibold rounded px-1.5 py-0.5"
          v-if="relation"
        >
          {{ relation }}
        </span>
      </NuxtLink>
    </div>

    <!-- 信息区 -->
    <NFlex class="relative h-8 px-1" align="center" justify="space-between">
      <!-- 播放量 -->
      <NTag size="small" :bordered="false" :color="{ color: '#00000000' }">
        <template #icon>
          <NIcon>
            <Icon name="material-symbols:play-circle" />
          </NIcon>
        </template>
        {{ viewDisplay }}
      </NTag>
      <!-- 菜单 -->
      <NButton v-if="id" @click="showMenu = true" size="tiny" quaternary>
        <template #icon>
          <NIcon>
            <Icon name="material-symbols:menu" />
          </NIcon>
        </template>
      </NButton>
      <NDrawer
        v-model:show="showMenu"
        :placement="isWide ? 'right' : 'bottom'"
        default-width="30%"
        default-height="50%"
        resizable
        :auto-focus="false"
      >
        <AnimeCardMenu :id="id" class="px-4" />
      </NDrawer>
    </NFlex>
  </div>
</template>
