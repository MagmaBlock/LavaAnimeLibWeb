<template>
  <AnimeCardBasic class="cursor-progress">
    <!-- 标题 -->
    <template #header> 播放列表 </template>
    <NSkeleton size="small" :sharp="false" class="my-1"></NSkeleton>
    <NSkeleton size="large" :sharp="false" class="my-1"></NSkeleton>
    <NSkeleton size="large" :sharp="false" class="w-1/2"></NSkeleton>
    <NSkeleton size="large" :sharp="false" class="my-1"></NSkeleton>
  </AnimeCardBasic>
</template>
