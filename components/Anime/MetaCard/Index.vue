<template>
  <div>
    <NCard
      size="small"
      :bordered="false"
      :embedded="embedded"
      v-if="store.animeInfo && store.animeInfoStatus === 'success'"
    >
      <template #default>
        <!-- 左右容器 -->
        <NFlex :wrap="false">
          <!-- 左侧封面图 -->
          <AnimeMetaCardPosterImage
            :poster-url="store.animeInfo?.posterUrl"
            class="hidden sm:block"
          />
          <!-- 纵向容器 -->
          <NFlex vertical class="flex-1">
            <NFlex :wrap="false" justify="space-between">
              <NFlex vertical>
                <!-- 标题行 -->
                <NFlex :align="'baseline'">
                  <AnimeMetaCardTitle
                    :title="store.animeInfo?.title"
                    :original-title="store.animeInfo?.originalTitle"
                  />
                  <AnimeMetaCardAttributeLabels
                    :bdrip="store.animeInfo?.bdrip"
                    :nsfw="store.animeInfo?.nsfw"
                  />
                </NFlex>
                <!-- 手机端封面图 -->
                <AnimeMetaCardPosterImage
                  :poster-url="store.animeInfo?.posterUrl"
                  :mini="true"
                  class="sm:hidden"
                />
                <!-- 基础信息行 -->
                <NFlex vertical size="small">
                  <NFlex class="text-gray-500">
                    <AnimeMetaCardPlatform
                      :platform="store.animeInfo?.platform"
                    />
                    <AnimeMetaCardReleaseDate
                      :date="store.animeInfo?.releaseDate"
                    />
                    <AnimeMetaCardTotalEpisodesCount
                      :count="store.animeInfo?.totalEpisodes"
                    />
                  </NFlex>
                  <NFlex class="text-gray-500">
                    <AnimeMetaCardViewCount
                      :views="store.animeInfo?.viewCount"
                    />
                    <AnimeMetaCardRating
                      :rating="store.animeInfo?.ratings[0]?.score"
                      :rank="store.animeInfo?.ratings[0]?.rank"
                    />
                    <AnimeMetaCardAnimeID :id="store.animeInfo?.id" />
                  </NFlex>
                </NFlex>
              </NFlex>
              <!-- 右侧按钮 -->
              <AnimeFollowButton :anime-id="store.animeInfo?.id" />
            </NFlex>

            <!-- Tags -->
            <AnimeMetaCardTags :tags="store.animeInfo?.tags" />

            <!-- 简介 -->
            <AnimeMetaCardIntroduction :content="store.animeInfo?.summary" />
          </NFlex>
        </NFlex>
      </template>
      <template #action v-if="store.animeInfo?.sites?.length > 0">
        <!-- 外部链接 -->
        <AnimeMetaCardExternalLinks :bgm-id="getBangumiId" />
      </template>
    </NCard>
    <NCard
      size="small"
      :bordered="false"
      :embedded="embedded"
      v-else-if="store.animeInfoStatus === 'pending'"
    >
      <NFlex :warp="false">
        <NSkeleton
          :width="128"
          :height="192"
          :sharp="false"
          class="hidden sm:block"
        />
        <NFlex vertical class="flex-1">
          <NSkeleton size="small" :sharp="false" :repeat="6" />
        </NFlex>
      </NFlex>
      <template #action>
        <NSkeleton size="small" :sharp="false" />
      </template>
    </NCard>
    <NCard
      size="small"
      :bordered="false"
      :embedded="embedded"
      v-else-if="store.animeInfoStatus === 'error'"
    >
      <NResult
        status="warning"
        title="发生错误"
        :description="`获取动画信息失败：${store.animeInfoError?.message}`"
        class="my-8"
      />
    </NCard>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  embedded?: boolean;
}>();

const store = useAnimeStore();

const getBangumiId = computed(() => {
  const bangumiSite = store.animeInfo?.sites?.find(
    (site) => site.siteType === "Bangumi",
  );
  return bangumiSite ? bangumiSite.siteId : null;
});
</script>

<style></style>
