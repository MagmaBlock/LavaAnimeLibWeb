import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 依赖组件自动引入
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // https://cn.vitejs.dev/config/shared-options.html
  // base:"https://s-sh-2164-bangumi.oss.dogecdn.com/",
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']},
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // https://cn.vitejs.dev/config/server-options.html
    host: '0.0.0.0',
    port: 3000,
    open: false,
  },
  build: {
    target: ['chrome71']
  },
  // experimental: {
  //   renderBuiltUrl(fileName) {
  //     return 'https://cdn.url/' + fileName
  //   }
  // }
})
