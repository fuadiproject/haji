/* eslint-disable @typescript-eslint/no-explicit-any */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@vite-pwa/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiBphUrl: process.env.API_BPH_URL,
    },
  },
  pwa: {
    registerType: "autoUpdate",
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    manifest: {
      name: "Haji App",
      short_name: "Haji",
      description: "Aplikasi Haji untuk kepegawaian dan persuratan",
      theme_color: "#3B82F6",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icons/icon-72x72.svg",
          sizes: "72x72",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-96x96.svg",
          sizes: "96x96",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-128x128.svg",
          sizes: "128x128",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-144x144.svg",
          sizes: "144x144",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-152x152.svg",
          sizes: "152x152",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-192x192.svg",
          sizes: "192x192",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-384x384.svg",
          sizes: "384x384",
          type: "image/svg+xml",
        },
        {
          src: "/icons/icon-512x512.svg",
          sizes: "512x512",
          type: "image/svg+xml",
        },
      ],
    },
  } as any,
});
