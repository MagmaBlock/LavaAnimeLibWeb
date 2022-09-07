<template>
  <div class="max-h-96">
    <div class="text-lg font-medium">帮助列表</div>
    <div class="text-xs my-2 text-gray-600">在这里你可以获取到一些帮助</div>
    <div class="mt-4 px-4 bg-gray-100 rounded-md overflow-y-scroll">
      <div class="text-sm py-2 font-medium rounded-md ease-in duration-100" v-for="thisArt in articles"
        @click="$emit('change-article', thisArt)"
        :class="{ 'text-blue-700 font-semibold': thisArt.content == article.content }">
        {{ thisArt.title || thisArt.content.match(/.*/)[0].replaceAll('#', '') }}
      </div>
    </div>
  </div>
</template>

<script>
import about from '../../assets/Help/about.md?raw';
import why3rdplayer from '../../assets/Help/why3rdplayer.md?raw'
import list3rdplayer from '../../assets/Help/list3rdplayer.md?raw'
export default {
  data() {
    return {
      articles: [
        { content: about },
        { content: why3rdplayer },
        { content: list3rdplayer }
      ]
    }
  },
  props: {
    article: Object
  },
  mounted() {
    this.$emit('change-article', { content: about })
  }
}

</script>