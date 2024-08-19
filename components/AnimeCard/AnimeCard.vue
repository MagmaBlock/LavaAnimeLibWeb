<script setup lang="ts">
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

const viewDisplay = computed(() => {
  if (!props.views) return "0";
  const views = props.views;
  return views > 9999 ? `${(views / 10000).toFixed(2)}万` : views.toString();
});
</script>

<template>
  <!-- 卡片 -->
  <div
    class="relative box-content overflow-hidden select-none rounded-md transition ease-out border-2 border-white/0 hover:border-2 hover:border-blue-600 hover:lg:brightness-90"
    @contextmenu="handleMenu"
  >
    <div class="absolute h-full w-full bg-gray-100 dark:bg-gray-500"></div>

    <!-- 上半：海报 + 标题 -->
    <div class="relative cursor-pointer overflow-hidden">
      <NuxtLink :to="{ name: 'anime-la', params: { la: id } }">
        <!-- 图片容器 -->
        <div class="aspect-w-2 aspect-h-3 overflow-hidden">
          <img :src="posterUrl" class="absolute object-cover" alt="封面图片" />
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
    <div class="relative h-8 dark:bg-zinc-700">
      <div class="flex h-full">
        <div class="grid basis-3/4 pl-3">
          <div class="flex place-items-center gap-x-[3px]">
            <Icon name="bi:play-btn" size="15" />
            <div>
              {{ viewDisplay }}
            </div>
          </div>
        </div>
        <div class="grid basis-1/4 place-items-center">
          <!-- 菜单 -->
          <ContainerMenuLarge v-model:show="showMenu" v-if="id">
            <template #trigger>
              <div
                class="grid place-items-center cursor-pointer rounded p-1.5 hover:bg-black/20"
              >
                <Icon name="bi:list" />
              </div>
            </template>
            <!-- <AnimeCardMenu :anime="anime" /> -->
          </ContainerMenuLarge>
        </div>
      </div>
    </div>
  </div>
</template>
