// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
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
});
