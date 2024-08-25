<template>
  <div>
    <NCard size="small" :bordered="false" embedded>
      <NFlex vertical>
        <!-- 标题和追番 -->
        <NFlex justify="space-between" :wrap="false">
          <NFlex :align="'baseline'" @click="openDetails">
            <AnimeMetaCardTitle :title="store.animeInfo?.title" />
          </NFlex>
          <AnimeFollowButton v-if="store.animeId" :anime-id="store.animeId" />
        </NFlex>
        <!-- 基础信息行 -->
        <NFlex vertical size="small" @click="openDetails">
          <NFlex justify="space-between">
            <NFlex class="text-gray-500">
              <AnimeMetaCardViewCount :views="store.animeInfo?.viewCount" />
              <AnimeMetaCardRating
                :rating="store.animeInfo?.ratings[0]?.score"
                :rank="store.animeInfo?.ratings[0]?.rank"
              />
              <AnimeMetaCardAttributeLabels
                :bdrip="store.animeInfo?.bdrip"
                :nsfw="store.animeInfo?.nsfw"
              />
            </NFlex>
            <AnimeMetaCardDetailsButton @click.stop="showDrawer = true" />
          </NFlex>
        </NFlex>
      </NFlex>
    </NCard>

    <NDrawer
      v-model:show="showDrawer"
      placement="bottom"
      :auto-focus="false"
      :default-height="600"
      resizable
    >
      <NDrawerContent
        title="详情"
        closable
        :body-content-style="{ padding: '8px' }"
      >
        <AnimeMetaCard />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script lang="ts" setup>
const store = useAnimeStore();
const showDrawer = ref(false);

const openDetails = () => {
  emits("open-details");
};

const emits = defineEmits(["open-details"]);
</script>

<style></style>
