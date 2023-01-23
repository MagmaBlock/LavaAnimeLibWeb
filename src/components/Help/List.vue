<template>
  <div class="max-h-96">
    <div class="text-lg font-medium">帮助列表</div>
    <div class="text-xs my-2 text-gray-500">在这里你可以获取到一些帮助</div>
    <div class="mt-4 bg-gray-100 dark:bg-zinc-800 rounded-md overflow-y-scroll">
      <div class="text-sm py-2 px-4 font-medium rounded-md ease-in duration-100
      hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-700"
        v-for="thisArt in articles" @click="$emit('change-article', thisArt)"
        :class="{ 'text-blue-600 font-semibold bg-gray-200': thisArt.content == article.content }">
        {{ thisArt.title || thisArt.content.match(/.*/)[0].replace(/#/g, '') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    article: Object,
    articles: Object
  }
}

</script>