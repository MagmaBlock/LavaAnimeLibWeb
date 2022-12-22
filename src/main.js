import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // src/router/index.js
import VueLazyLoad from 'vue3-lazyload'
import './index.css' // tailwind directives
import './transition.css' // 自定义的切换动画

export const app = createApp(App)
  .use(router)
  .use(VueLazyLoad)

app.config.unwrapInjectedRef = true
app.mount('#app')
