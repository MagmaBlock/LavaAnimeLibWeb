<template>
  <NCarousel
    show-arrow
    draggable
    centered-slides
    :space-between="20"
    :on-update:current-index="handleSwitch"
    dot-type="line"
    class="shadow-lg"
    ref="carousel"
  >
    <template v-for="pic in headerPic">
      <div class="static h-52 sm:h-64 lg:h-72">
        <!-- 如果为视频 -->
        <video
          v-if="pic?.video"
          class="object-cover w-full min-h-full overflow-hidden"
          :src="pic.pic"
          autoplay
          muted
          loop
          playsinline
          disablepictureinpicture
        ></video>
        <!-- 如果为图片 -->
        <img
          class="object-cover w-full min-h-full overflow-hidden"
          :src="pic.pic"
          v-else
        />
        <!-- 底部阴影 -->
        <div
          class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/75"
        ></div>
        <!-- 有链接且站内 -->
        <RouterLink v-if="pic.url && !pic.externalUrl" :to="pic.url">
          <HomeHeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle" />
        </RouterLink>
        <!-- 有链接且站外 -->
        <a
          v-else-if="pic.url && pic.externalUrl"
          :href="pic.url"
          target="_blank"
        >
          <HomeHeaderPictureTitle :title="pic.title" :subtitle="pic.subtitle" />
        </a>
        <!-- 无链接 -->
        <HomeHeaderPictureTitle
          v-else
          :title="pic.title"
          :subtitle="pic.subtitle"
        />
      </div>
    </template>
  </NCarousel>
</template>

<script setup>
import { onMounted, ref, toRefs, watch } from "vue";

const props = defineProps({
  customdata: Array,
});

// props 不是响应式，转成响应式再监听
const { customdata } = toRefs(props);
watch(customdata, (newData) => {
  headerPic.value = newData;
});

let headerPic = ref([
  {
    pic: "/Home/headerPic/LavaAnime.jpg",
    url: "",
    title: "熔岩番剧库 LavaAnimeLib",
    subtitle: "",
  },
]);

onMounted(async () => {
  if (props.customdata) {
    headerPic.value = props.customdata;
  } else {
    headerPic.value = await getData();
  }
});

const autoSwitchInterval = 8000;
let autoSwitch = setInterval(switchNext, autoSwitchInterval);

/**
 * 获取头图数据
 * @returns {Array}
 */
async function getData() {
  try {
    let fromAPI = await LavaAnimeAPI.get("/v2/home/header/get");
    if (fromAPI.data.code == 200) return fromAPI.data.data;
    else return [];
  } catch (error) {
    console.error("请求头图数据失败: ", error);
    return [];
  }
}

// 换页后，总是重置自动换页，以免不自然的操作体验
function handleSwitch() {
  clearInterval(autoSwitch);
  autoSwitch = setInterval(switchNext, autoSwitchInterval);
}

const carousel = ref(null);
function switchNext() {
  carousel.value?.next();
}
</script>
