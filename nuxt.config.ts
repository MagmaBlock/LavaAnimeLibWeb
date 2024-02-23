// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "nuxt-icon",
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
      link: [
        {
          rel: "preload",
          as: "style",
          onload: "this.rel='stylesheet'",
          href: "https://registry.npmmirror.com/bootstrap-icons/1.10.5/files/font/bootstrap-icons.min.css",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  css: ["~/assets/css/scrollbar.css", "~/assets/css/transition.css"],
  typescript: {
    shim: false,
  },
});
