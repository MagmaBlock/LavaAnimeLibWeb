<template>
  <div>
    <NCard
      size="small"
      :bordered="false"
      embedded
      v-if="animeInfo && status === 'success'"
    >
      <template #default>
        <!-- 左右容器 -->
        <NFlex :wrap="false">
          <!-- 左侧封面图 -->
          <AnimeMetaCardPosterImage
            :poster-url="animeInfo?.posterUrl"
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
            <AnimeMetaCardTags :tags="animeInfo?.tags" />

            <!-- 简介 -->
            <AnimeMetaCardIntroduction :content="animeInfo?.summary" />
          </NFlex>
        </NFlex>
      </template>
      <template #action>
        <!-- 外部链接 -->
        <AnimeMetaCardExternalLinks :bgm-id="getBangumiId" />
      </template>
    </NCard>
    <NCard
      size="small"
      :bordered="false"
      embedded
      v-else-if="status === 'pending'"
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
      embedded
      v-else-if="status === 'error'"
    >
      <NResult
        status="warning"
        title="发生错误"
        :description="`获取动画信息失败：${error?.message}`"
        class="my-8"
      />
    </NCard>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  animeId: number;
}>();

const { $client } = useNuxtApp();

const {
  data: animeInfo,
  status,
  execute,
  error,
} = await useAsyncData("animeInfo", () =>
  $client.pages.anime.getAnimeInfo.query({ animeId: props.animeId })
);

const getBangumiId = computed(() => {
  const bangumiSite = animeInfo.value?.sites?.find(
    (site) => site.siteType === "Bangumi"
  );
  return bangumiSite ? bangumiSite.siteId : null;
});

watch(
  () => props.animeId,
  () => {
    execute();
  }
);
</script>

<style></style>
