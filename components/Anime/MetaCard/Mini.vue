<template>
  <NCard size="small" :bordered="false">
    <NFlex vertical>
      <!-- 标题和追番 -->
      <NFlex justify="space-between" :wrap="false">
        <NFlex :align="'baseline'" @click="emits('open-details')">
          <AnimeMetaCardTitle :title="store.animeData?.title" />
        </NFlex>
        <AnimeFollowButton v-if="store.laID" :anime-id="store.laID" />
      </NFlex>
      <!-- 基础信息行 -->
      <NFlex vertical size="small" @click="emits('open-details')">
        <NFlex justify="space-between">
          <NFlex class="text-gray-500">
            <AnimeMetaCardViewCount :views="store.animeData?.views" />
            <AnimeMetaCardRating
              :rating="store.animeData?.rating?.score"
              :rank="store.animeData?.rating?.rank"
            />
            <AnimeMetaCardAttributeLabels
              :bdrip="store.animeData?.type?.bdrip"
              :nsfw="store.animeData?.type?.nsfw"
            />
          </NFlex>
          <AnimeMetaCardDetailsButton />
        </NFlex>
      </NFlex>
    </NFlex>
  </NCard>
</template>

<script lang="ts" setup>
const store = useAnimeStore();

const emits = defineEmits(["open-details"]);
</script>

<style></style>
