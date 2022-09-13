<template>
  <div class="grid">
    <div class="place-self-center py-4
    prose prose-sm
    prose-p:my-1 prose-headings:my-2
    prose-blockquote:my-1 prose-ul:my-0 prose-li:my-0 prose-pre:my-2
    prose-hr:my-3
    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline" v-html="html">
    </div>
  </div>
</template>


<script>
import { marked } from 'marked';


export default {
  data() {
    return {
      html: marked.parse(this.content),
      notSupport: false
    }
  },
  props: {
    content: String
  },
  watch: {
    content(n, o) {
      this.html = marked.parse(n)
    }
  }
}

</script>