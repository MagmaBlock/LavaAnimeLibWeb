<template>
  <AnimeCardBasic class="sm:mb-4 select-none cursor-progress">
    <!-- 标题 -->
    <template #header> 正片 </template>
    <NSkeleton size="large" :sharp="false" class="my-1"></NSkeleton>
    <NSkeleton size="large" :sharp="false" class="w-1/2"></NSkeleton>
  </AnimeCardBasic>
</template>
