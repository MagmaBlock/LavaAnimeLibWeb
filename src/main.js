import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // src/router/index.js
import VueLazyLoad from 'vue3-lazyload'
import './index.css' // tailwind directives

const app = createApp(App)
  .use(router)
  .use(VueLazyLoad)
  .mount('#app')