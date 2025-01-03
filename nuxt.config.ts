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
      apiBaseUrl: process.env.SERVER_BASE_URL,
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
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
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
          icons: [
            {
              src: "pwa/shortcuts/FluentCollections16Filled.svg",
            },
          ],
        },
        {
          name: "搜索番剧",
          description: "在番剧库内搜索",
          url: "/search",
          icons: [
            {
              src: "pwa/shortcuts/FluentSearch16Filled.svg",
            },
          ],
        },
        {
          name: "我的",
          description: "查看个人历史和追番",
          url: "/user",
          icons: [
            {
              src: "pwa/shortcuts/FluentLibrary16Filled.svg",
            },
          ],
        },
      ],
      icons: [
        {
          src: "pwa/windows11/SmallTile.scale-100.png",
          sizes: "71x71",
        },
        {
          src: "pwa/windows11/SmallTile.scale-125.png",
          sizes: "89x89",
        },
        {
          src: "pwa/windows11/SmallTile.scale-150.png",
          sizes: "107x107",
        },
        {
          src: "pwa/windows11/SmallTile.scale-200.png",
          sizes: "142x142",
        },
        {
          src: "pwa/windows11/SmallTile.scale-400.png",
          sizes: "284x284",
        },
        {
          src: "pwa/windows11/Square150x150Logo.scale-100.png",
          sizes: "150x150",
        },
        {
          src: "pwa/windows11/Square150x150Logo.scale-125.png",
          sizes: "188x188",
        },
        {
          src: "pwa/windows11/Square150x150Logo.scale-150.png",
          sizes: "225x225",
        },
        {
          src: "pwa/windows11/Square150x150Logo.scale-200.png",
          sizes: "300x300",
        },
        {
          src: "pwa/windows11/Square150x150Logo.scale-400.png",
          sizes: "600x600",
        },
        {
          src: "pwa/windows11/Wide310x150Logo.scale-100.png",
          sizes: "310x150",
        },
        {
          src: "pwa/windows11/Wide310x150Logo.scale-125.png",
          sizes: "388x188",
        },
        {
          src: "pwa/windows11/Wide310x150Logo.scale-150.png",
          sizes: "465x225",
        },
        {
          src: "pwa/windows11/Wide310x150Logo.scale-200.png",
          sizes: "620x300",
        },
        {
          src: "pwa/windows11/Wide310x150Logo.scale-400.png",
          sizes: "1240x600",
        },
        {
          src: "pwa/windows11/LargeTile.scale-100.png",
          sizes: "310x310",
        },
        {
          src: "pwa/windows11/LargeTile.scale-125.png",
          sizes: "388x388",
        },
        {
          src: "pwa/windows11/LargeTile.scale-150.png",
          sizes: "465x465",
        },
        {
          src: "pwa/windows11/LargeTile.scale-200.png",
          sizes: "620x620",
        },
        {
          src: "pwa/windows11/LargeTile.scale-400.png",
          sizes: "1240x1240",
        },
        {
          src: "pwa/windows11/Square44x44Logo.scale-100.png",
          sizes: "44x44",
        },
        {
          src: "pwa/windows11/Square44x44Logo.scale-125.png",
          sizes: "55x55",
        },
        {
          src: "pwa/windows11/Square44x44Logo.scale-150.png",
          sizes: "66x66",
        },
        {
          src: "pwa/windows11/Square44x44Logo.scale-200.png",
          sizes: "88x88",
        },
        {
          src: "pwa/windows11/Square44x44Logo.scale-400.png",
          sizes: "176x176",
        },
        {
          src: "pwa/windows11/StoreLogo.scale-100.png",
          sizes: "50x50",
        },
        {
          src: "pwa/windows11/StoreLogo.scale-125.png",
          sizes: "63x63",
        },
        {
          src: "pwa/windows11/StoreLogo.scale-150.png",
          sizes: "75x75",
        },
        {
          src: "pwa/windows11/StoreLogo.scale-200.png",
          sizes: "100x100",
        },
        {
          src: "pwa/windows11/StoreLogo.scale-400.png",
          sizes: "200x200",
        },
        {
          src: "pwa/windows11/SplashScreen.scale-100.png",
          sizes: "620x300",
        },
        {
          src: "pwa/windows11/SplashScreen.scale-125.png",
          sizes: "775x375",
        },
        {
          src: "pwa/windows11/SplashScreen.scale-150.png",
          sizes: "930x450",
        },
        {
          src: "pwa/windows11/SplashScreen.scale-200.png",
          sizes: "1240x600",
        },
        {
          src: "pwa/windows11/SplashScreen.scale-400.png",
          sizes: "2480x1200",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-16.png",
          sizes: "16x16",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-20.png",
          sizes: "20x20",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-24.png",
          sizes: "24x24",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-30.png",
          sizes: "30x30",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-32.png",
          sizes: "32x32",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-36.png",
          sizes: "36x36",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-40.png",
          sizes: "40x40",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-44.png",
          sizes: "44x44",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-48.png",
          sizes: "48x48",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-60.png",
          sizes: "60x60",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-64.png",
          sizes: "64x64",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-72.png",
          sizes: "72x72",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-80.png",
          sizes: "80x80",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-96.png",
          sizes: "96x96",
        },
        {
          src: "pwa/windows11/Square44x44Logo.targetsize-256.png",
          sizes: "256x256",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
          sizes: "16x16",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
          sizes: "20x20",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
          sizes: "24x24",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
          sizes: "30x30",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
          sizes: "32x32",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
          sizes: "36x36",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
          sizes: "40x40",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
          sizes: "44x44",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
          sizes: "48x48",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
          sizes: "60x60",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
          sizes: "64x64",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
          sizes: "72x72",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
          sizes: "80x80",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
          sizes: "96x96",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
          sizes: "256x256",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
          sizes: "16x16",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
          sizes: "20x20",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
          sizes: "24x24",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
          sizes: "30x30",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
          sizes: "32x32",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
          sizes: "36x36",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
          sizes: "40x40",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
          sizes: "44x44",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
          sizes: "48x48",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
          sizes: "60x60",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
          sizes: "64x64",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
          sizes: "72x72",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
          sizes: "80x80",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
          sizes: "96x96",
        },
        {
          src: "pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
          sizes: "256x256",
        },
        {
          src: "pwa/android/android-launchericon-512-512.png",
          sizes: "512x512",
        },
        {
          src: "pwa/android/android-launchericon-192-192.png",
          sizes: "192x192",
        },
        {
          src: "pwa/android/android-launchericon-144-144.png",
          sizes: "144x144",
        },
        {
          src: "pwa/android/android-launchericon-96-96.png",
          sizes: "96x96",
        },
        {
          src: "pwa/android/android-launchericon-72-72.png",
          sizes: "72x72",
        },
        {
          src: "pwa/android/android-launchericon-48-48.png",
          sizes: "48x48",
        },
        {
          src: "pwa/ios/16.png",
          sizes: "16x16",
        },
        {
          src: "pwa/ios/20.png",
          sizes: "20x20",
        },
        {
          src: "pwa/ios/29.png",
          sizes: "29x29",
        },
        {
          src: "pwa/ios/32.png",
          sizes: "32x32",
        },
        {
          src: "pwa/ios/40.png",
          sizes: "40x40",
        },
        {
          src: "pwa/ios/50.png",
          sizes: "50x50",
        },
        {
          src: "pwa/ios/57.png",
          sizes: "57x57",
        },
        {
          src: "pwa/ios/58.png",
          sizes: "58x58",
        },
        {
          src: "pwa/ios/60.png",
          sizes: "60x60",
        },
        {
          src: "pwa/ios/64.png",
          sizes: "64x64",
        },
        {
          src: "pwa/ios/72.png",
          sizes: "72x72",
        },
        {
          src: "pwa/ios/76.png",
          sizes: "76x76",
        },
        {
          src: "pwa/ios/80.png",
          sizes: "80x80",
        },
        {
          src: "pwa/ios/87.png",
          sizes: "87x87",
        },
        {
          src: "pwa/ios/100.png",
          sizes: "100x100",
        },
        {
          src: "pwa/ios/114.png",
          sizes: "114x114",
        },
        {
          src: "pwa/ios/120.png",
          sizes: "120x120",
        },
        {
          src: "pwa/ios/128.png",
          sizes: "128x128",
        },
        {
          src: "pwa/ios/144.png",
          sizes: "144x144",
        },
        {
          src: "pwa/ios/152.png",
          sizes: "152x152",
        },
        {
          src: "pwa/ios/167.png",
          sizes: "167x167",
        },
        {
          src: "pwa/ios/180.png",
          sizes: "180x180",
        },
        {
          src: "pwa/ios/192.png",
          sizes: "192x192",
        },
        {
          src: "pwa/ios/256.png",
          sizes: "256x256",
        },
        {
          src: "pwa/ios/512.png",
          sizes: "512x512",
        },
        {
          src: "pwa/ios/1024.png",
          sizes: "1024x1024",
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
