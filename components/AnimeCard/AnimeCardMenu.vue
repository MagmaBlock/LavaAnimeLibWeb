<template>
  <NList clickable hoverable class="sm:w-80 select-none">
    <NListItem class="select-text">
      <div class="text-lg">{{ anime?.title || "..." }}</div>
      <div class="text-xs">
        {{ anime?.index?.year }} {{ anime?.index?.type }}
      </div>
      <template #suffix>
        <div
          v-if="anime.id"
          @click="$router.push({ name: 'Anime', params: { la: anime.id } })"
          class="cursor-pointer"
        >
          <Icon name="fluent:chevron-right-24-filled" size="18" />
        </div>
      </template>
    </NListItem>

    <!-- -1 未追番 -->
    <NListItem @click="editFollow(1)" v-if="followInfo.status == -1">
      <div class="flex gap-x-4 items-center">
        <Icon name="fluent:add-24-filled" size="18" />
        添加到追番
      </div>
    </NListItem>
    <!-- 0-2 已追番 -->
    <NListItem
      class="text-blue-400"
      @click="editFollow(undefined, true)"
      v-else-if="followInfo.status >= 0"
    >
      <div class="flex gap-x-4 items-center">
        <Icon name="fluent:subtract-24-filled" size="18" />
        取消追番
      </div>
    </NListItem>
    <!-- undefined 加载中, -2 错误 -->
    <NListItem v-else-if="followInfo.status != -2">
      <NSkeleton text />
    </NListItem>

    <NListItem v-if="followInfo.status != -2">
      <div class="flex gap-x-4 items-center">
        <Icon name="fluent:bookmark-add-24-filled" size="18" />
        标记为
      </div>
      <template #suffix>
        <div class="flex flex-nowrap">
          <NButtonGroup size="tiny">
            <NButton
              :type="followInfo?.status == 0 ? 'primary' : 'default'"
              @click="editFollow(0)"
              quaternary
            >
              想看
            </NButton>
            <NButton
              :type="followInfo?.status == 1 ? 'primary' : 'default'"
              @click="editFollow(1)"
              quaternary
            >
              在看
            </NButton>
            <NButton
              :type="followInfo?.status == 2 ? 'primary' : 'default'"
              @click="editFollow(2)"
              quaternary
            >
              看过
            </NButton>
          </NButtonGroup>
        </div>
      </template>
    </NListItem>

    <NListItem v-if="anime?.bgmID">
      <a :href="anime?.images.large" target="_blank">
        <div class="flex gap-x-4 items-center">
          <Icon name="fluent:image-search-24-filled" size="18" />
          查看封面大图
        </div>
      </a>
    </NListItem>

    <NListItem v-if="anime?.bgmID">
      <a :href="'https://bgm.tv/subject/' + anime.bgmID" target="_blank">
        <div class="flex gap-x-4 items-center">
          <Icon name="fluent:attach-arrow-right-24-filled" size="18" />
          去番组计划查看本作品
        </div>
      </a>
    </NListItem>
  </NList>
</template>

<script setup>
const { anime } = defineProps({
  anime: { type: Object },
});
const followInfo = ref({});

getFollowInfo();
async function getFollowInfo() {
  if (anime?.id) {
    try {
      let info = await lavaAnimeAPIs.getAnimeFollowInfoAPI(anime?.id);
      if (info.data.data) {
        followInfo.value = info.data.data;
      }
    } catch (error) {
      followInfo.value = { status: -2 };
    }
  }
}

async function editFollow(status, remove) {
  let followedBefore = followInfo.value?.status != -1;
  try {
    let result = await lavaAnimeAPIs.editAnimeFollowAPI(
      anime?.id,
      status,
      remove
    );
    if (result.data?.code == 200) {
      if (!followedBefore && !remove)
        window.$message.success("自己追的番就要好好看完哦^O^");
      if (remove) window.$message.success("已取消追番");
    }
  } catch (error) {}

  getFollowInfo();
}
</script>
