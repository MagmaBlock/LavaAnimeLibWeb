import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 依赖组件自动引入
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // https://cn.vitejs.dev/config/shared-options.html
  // base:"https://s-sh-2164-bangumi.oss.dogecdn.com/",
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "熔岩番剧库",
        short_name: "熔岩番剧库",
        description: "熔岩番剧库 LavaAnimeLib",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // https://cn.vitejs.dev/config/server-options.html
    host: "0.0.0.0",
    port: 3000,
    open: false,
  },
  build: {
    target: ["chrome71"],
  },
  // experimental: {
  //   renderBuiltUrl(fileName) {
  //     return 'https://cdn.url/' + fileName
  //   }
  // }
});
