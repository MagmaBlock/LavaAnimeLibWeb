<template>
  <div v-for="(collection, index) in collections" class="px-6 sm:px-0">
    <div v-if="index < showIndex">
      <!-- 大标题块 -->
      <div class="flex my-4">
        <div class="flex-wrap">
          <span class="whitespace-nowrap text-lg mr-2 font-medium">
            {{ collection.title }}
          </span>
          <span class="whitespace-nowrap text-sm sm:text-base opacity-50">
            {{ collection.subtitle }}
          </span>
        </div>
      </div>
      <!-- 内容总块 -->
      <div class="grid lg:grid-cols-1 gap-2">
        <!-- 单内容块 -->
        <div
          v-for="content in collection.content"
          class="bg-gray-50 dark:bg-zinc-800 rounded px-4 lg:px-6 py-3"
        >
          <!-- 小标题 -->
          <div class="opacity-60 md:text-base font-medium mb-2">
            {{ content.title }}
          </div>
          <HomeCollectionCards
            :ids="content.anime"
            class="flex flex-shrink-0"
          />
        </div>
      </div>
    </div>
    <UniListShowMore v-else v-if="index == showIndex" :onSee="showAdd" />
  </div>
</template>

<script setup>
const showIndex = ref(1);

const showAdd = () => {
  showIndex.value = showIndex.value + 1;
};

const collections = [
  {
    id: "2023-04",
    title: "🌈2023年4月春季新番推荐",
    subtitle: "",
    background: "",
    content: [
      {
        title: "爱情的滋味，搞笑的节奏！—— 恋爱喜剧",
        anime: [633, 638, 628, 635, 626, 630, 617],
      },
      {
        title: "神秘魔幻，跨越时空！—— 奇幻新世界",
        anime: [636, 639, 633, 627, 640, 615, 618],
      },
      {
        title: "勇气与智慧的碰撞！—— 冒险智斗 励志热血",
        anime: [632, 625, 624, 634, 637, 629, 619],
      },
      {
        title: "青春，勇攀高峰！—— 社团 / 运动 / 竞技",
        anime: [642, 641, 628, 631, 616],
      },
    ],
  },
  {
    id: "2023-01",
    title: "❄️2023年1月新番",
    subtitle: "业界冬眠...",
    background: "",
    content: [
      {
        title: "番组计划收藏榜前十",
        anime: [572, 575, 586, 580, 579, 594, 571, 581, 573, 574],
      },
      {
        title: "奇幻日常喜剧!",
        anime: [572, 575, 574, 577, 593, 579, 578, 582, 590],
      },
      {
        title: "奇幻热血、战斗与冒险, 不可预测的命运之舞台",
        anime: [571, 586, 588, 580, 584, 591, 583, 592],
      },
      {
        title: "异世界!",
        anime: [575, 573, 595, 593, 589],
      },
      {
        title: "仍未完结、即将到来的剧场版",
        anime: [557, 564, 396, 494, 433, 477],
      },
      {
        title: "运动! 户外, 青春与少年",
        anime: [587],
      },
    ],
  },
  {
    id: "2022-10",
    title: "🍁2022年10月新番",
    subtitle: "2022年最后一个季度, 来看看新番吧",
    background: "",
    content: [
      {
        title: "十月续作 / 游戏改",
        anime: [
          534, 398, 559, 394, 545, 543, 553, 554, 560, 562, 563, 564, 395, 396,
          527,
        ],
      },
      {
        title: "十月完全新作",
        anime: [552, 558, 561, 541, 542, 544, 546, 555, 557, 434, 566],
      },
      {
        title: "轻百日常 摩多摩多~",
        anime: [395, 434, 544, 558, 563, 542, 562],
      },
      {
        title: "最受番剧库用户期待的前10部作品",
        anime: [560, 559, 564, 561, 554, 555, 557, 562, 566],
      },
      {
        title: "开播前网络关注榜",
        anime: [398, 559, 546, 534, 394, 560, 553, 527],
      },
      {
        title: "连载中的前季动画 / 即将上映 / 其他",
        anime: [494, 509, 519],
      },
    ],
  },
  {
    id: "2022-7",
    title: "🥳2022年7月新番",
    subtitle: "7月新番热播中！",
    background: "",
    content: [
      {
        index: 0,
        title: "7月热播新番",
        anime: [494, 401, 405, 444, 497, 501, 425, 495],
      },
      {
        index: 1,
        title: "恋爱日常 奇幻冒险 以及...异世界？",
        anime: [403, 495, 497, 499, 501, 503, 507, 508, 504],
      },
      {
        index: 2,
        title: "热门续作衍生",
        anime: [400, 401, 404, 405, 425, 496, 498, 500, 502, 504, 507, 531],
      },
      {
        index: 3,
        title: "偶像、艺术与科幻",
        anime: [400, 505, 506, 496],
      },
      {
        index: 4,
        title: "四月持续连载",
        anime: [371, 433],
      },
    ],
  },
  {
    id: "2022-4",
    title: "🌱2022年4月新番",
    subtitle: "2022年4月新番陆续完结~ 熔岩番剧库 27 部作品在线看",
    background: "",
    content: [
      {
        index: 0,
        title: "备受期待，热门改编",
        anime: [371, 332, 338, 331, 372, 359, 424],
      },
      {
        index: 1,
        title: "四月续作",
        anime: [334, 341, 336, 339, 342, 340, 337, 357, 333, 433],
      },
      {
        index: 2,
        title: "恋爱日常，治愈休闲",
        anime: [361, 374, 360, 392, 362, 335, 432],
      },
      {
        index: 3,
        title: "轻改、异世界",
        anime: [431, 430],
      },
      {
        index: 4,
        title: "持续连载、剧场版",
        anime: [79, 364],
      },
    ],
  },
];
</script>
