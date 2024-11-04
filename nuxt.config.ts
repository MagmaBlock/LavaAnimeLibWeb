// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vite-pwa/nuxt",
    // "nuxt-icon",
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: "https://anime-api.5t5.top",
    },
  },
  ssr: false,
  imports: {
    dirs: ["composables/store/*.{js,ts}"],
  },
  piniaPersistedstate: {
    storage: "localStorage",
  },
  app: {
    head: {
      meta: [
        {
          name: "description",
          content: "熔岩番剧库 LavaAnimeLib",
        },
        {
          name: "theme-color",
          content: "#ffffff",
          media: "(prefers-color-scheme: light)",
        },
        {
          name: "theme-color",
          content: "#101014",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        {
          rel: "preload",
          as: "style",
          onload: "this.rel='stylesheet'",
          href: "https://registry.npmmirror.com/bootstrap-icons/1.10.5/files/font/bootstrap-icons.min.css",
          crossorigin: "anonymous",
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
      ],
      script: [
        {
          async: true,
          src: "https://umami.magma.ink/script.js",
          "data-website-id": "bcf9db29-ac5a-449c-a35d-259655934be1",
        },
        {
          async: true,
          src: "https://hm.baidu.com/hm.js?c3b6ee9c2eff1642f7465f8e97766227",
        },
      ],
    },
  },
  css: ["~/assets/css/scrollbar.css", "~/assets/css/transition.css"],
  typescript: {
    shim: false,
  },
  pwa: {
    registerType: "prompt",
    includeAssets: ["favicon.ico", "icon.svg", "apple-touch-icon.png"],
    manifest: {
      name: "熔岩番剧库 LavaAnimeLib",
      short_name: "熔岩番剧库",
      description: "您可将番剧库添加为 PWA 应用，可获得更佳体验（无需下载）",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
      lang: "zh-CN",
      start_url: "/",
      display: "standalone",
      display_override: ["standalone", "fullscreen"],
      shortcuts: [
        {
          name: "番剧索引",
          description: "寻找历年番剧",
          url: "/anime-index",
        },
        {
          name: "搜索番剧",
          description: "在番剧库内搜索",
          url: "/search",
        },
        {
          name: "我的",
          description: "查看个人历史和追番",
          url: "/user",
        },
      ],
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,ico,png,svg}"],
    },
    devOptions: {
      enabled: false,
    },
  },
  vite: {
    build: {
      target: ["chrome71"],
      sourcemap: true,
    },
  },
});
