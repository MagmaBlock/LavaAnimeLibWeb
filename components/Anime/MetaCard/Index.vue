<template>
  <NCard size="small" :bordered="false">
    <template #default>
      <!-- 左右容器 -->
      <NFlex :wrap="false">
        <!-- 左侧封面图 -->
        <AnimeMetaCardPosterImage
          :poster-url="animeInfo?.posterUrl"
          :loading="status === 'pending'"
          class="hidden sm:block"
        />
        <!-- 纵向容器 -->
        <NFlex vertical class="flex-1">
          <NFlex :wrap="false" justify="space-between">
            <NFlex vertical>
              <!-- 标题行 -->
              <NFlex :align="'baseline'">
                <AnimeMetaCardTitle
                  :title="animeInfo?.title"
                  :original-title="animeInfo?.originalTitle"
                  :loading="status === 'pending'"
                />
                <AnimeMetaCardAttributeLabels
                  :bdrip="animeInfo?.bdrip"
                  :nsfw="animeInfo?.nsfw"
                />
              </NFlex>
              <!-- 手机端封面图 -->
              <AnimeMetaCardPosterImage
                :poster-url="animeInfo?.posterUrl"
                :mini="true"
                class="sm:hidden"
              />
              <!-- 基础信息行 -->
              <NFlex vertical size="small">
                <NFlex class="text-gray-500">
                  <AnimeMetaCardPlatform :platform="animeInfo?.platform" />
                  <AnimeMetaCardReleaseDate :date="animeInfo?.releaseDate" />
                  <AnimeMetaCardTotalEpisodesCount
                    :count="animeInfo?.totalEpisodes"
                  />
                </NFlex>
                <NFlex class="text-gray-500">
                  <AnimeMetaCardViewCount :views="animeInfo?.viewCount" />
                  <AnimeMetaCardRating
                    :rating="animeInfo?.ratings[0]?.score"
                    :rank="animeInfo?.ratings[0]?.rank"
                  />
                  <AnimeMetaCardAnimeID :id="animeInfo?.id" />
                </NFlex>
              </NFlex>
            </NFlex>
            <!-- 右侧按钮 -->
            <AnimeFollowButton :anime-id="animeInfo?.id" />
          </NFlex>

          <!-- Tags -->
          <AnimeMetaCardTags
            :tags="animeInfo?.tags"
            :loading="status === 'pending'"
          />

          <AnimeMetaCardIntroduction
            :content="animeInfo?.summary"
            :loading="status === 'pending'"
          />
        </NFlex>
      </NFlex>
    </template>
    <template #action>
      <!-- 外部链接 -->
      <AnimeMetaCardExternalLinks :bgm-id="getBangumiId" />
    </template>
  </NCard>
</template>

<script lang="ts" setup>
const route = useRoute();
const { $client } = useNuxtApp();

const animeId = computed(() => Number(route.params.la));
const { data: animeInfo, status } = await useAsyncData("animeInfo", () =>
  $client.pages.anime.getAnimeInfo.query({ animeId: animeId.value })
);

const getBangumiId = computed(() => {
  const bangumiSite = animeInfo.value?.sites?.find(
    (site) => site.siteType === "Bangumi"
  );
  return bangumiSite ? bangumiSite.siteId : null;
});
</script>

<style></style>
