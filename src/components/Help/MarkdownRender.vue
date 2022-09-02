<template>
  <div ref="markdown" v-html="html" class="prose"></div>
</template>


<script>
import { marked } from 'marked';
console.log(marked.parse);

export default {
  data() {
    return {
      html: marked.parse(this.content)
    }
  },
  props: {
    content: String
  }
}

</script>