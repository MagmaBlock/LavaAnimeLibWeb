import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // src/router/index.js
import './index.css' // tailwind directives

const app = createApp(App)
  .use(router)
  .mount('#app')