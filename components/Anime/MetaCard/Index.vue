<template>
  <div>
    <AnimeCardBasic>
      <template #header>
        <!-- 头部面包屑 -->
        <AnimeMetaCardIndexBreadcrumb
          :year="store.animeData?.index?.year"
          :type="store.animeData?.index?.type"
          :name="store.animeData?.index?.name"
          @open-admin-tools="() => (store.showAdminTools = true)"
        />
      </template>
      <template #default>
        <!-- 左右容器 -->
        <NFlex :wrap="false">
          <!-- 左侧封面图 -->
          <AnimeMetaCardPosterImage
            :poster-url="store.animeData?.images?.poster"
            class="hidden sm:block"
          />
          <!-- 纵向容器 -->
          <NFlex vertical>
            <NFlex :wrap="false" justify="space-between">
              <NFlex vertical>
                <!-- 标题行 -->
                <NFlex :align="'baseline'">
                  <AnimeMetaCardTitle
                    :title="store.animeData?.title"
                    :original-title="store.animeData?.name"
                  />
                  <AnimeMetaCardAttributeLabels
                    :bdrip="store.animeData?.type?.bdrip"
                    :nsfw="store.animeData?.type?.nsfw"
                  />
                </NFlex>
                <!-- 基础信息行 -->
                <NFlex vertical size="small">
                  <NFlex class="text-gray-500">
                    <AnimeMetaCardPlatform
                      :platform="store.animeData?.platform"
                    />
                    <AnimeMetaCardReleaseDate :date="store.animeData?.date" />
                    <AnimeMetaCardTotalEpisodesCount
                      :count="store.animeData?.eps"
                    />
                  </NFlex>
                  <NFlex class="text-gray-500">
                    <AnimeMetaCardViewCount :views="store.animeData?.views" />
                    <AnimeMetaCardRating
                      :rating="store.animeData?.rating?.score"
                      :rank="store.animeData?.rating?.rank"
                    />
                    <AnimeMetaCardAnimeID :id="store.animeData?.id" />
                  </NFlex>
                </NFlex>
              </NFlex>
              <!-- 飘在右上角的追番按钮 -->
              <AnimeFollowButton v-if="store.laID" :anime-id="store.laID" />
            </NFlex>

            <!-- Tags -->
            <AnimeMetaCardTags :tags="store.animeData?.tags" />

            <!-- 外部链接 -->
            <AnimeMetaCardExternalLinks
              :bgm-id="store.bgmID"
              :official-website="getWebsite"
            />
          </NFlex>
        </NFlex>
      </template>
    </AnimeCardBasic>
  </div>
</template>

<script lang="ts" setup>
const store = useAnimeStore();

const getWebsite = computed(() => {
  if (!store.animeData?.infobox) return;
  let result = store.animeData?.infobox?.find((kv) => {
    return ["官方网站", "官网", "网站"].includes(kv.key);
  });
  if (result?.value) {
    return result.value;
  } else return;
});
</script>

<style></style>
