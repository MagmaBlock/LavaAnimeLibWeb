<template>
  <div class="grid">
    <div class="place-self-center markdown-body max-w-3xl py-4 lg:px-20
    dark:bg-neutral-900 dark:text-zinc-200" v-html="html">
    </div>
  </div>
</template>


<script>
import {marked} from 'marked';
import 'github-markdown-css/github-markdown-light.css';
import './markdown.css';


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