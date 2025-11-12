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
  css: ["@/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV,
      apiBaseUrl: process.env.API_BASE_URL,
      apiPresensiUrl: process.env.API_PRESENSI_URL,
      apiHajiUrl: process.env.API_HAJI_URL,
      apiSuratUrl: process.env.API_SURAT_URL,
      apiSuperAppUrl: process.env.API_SUPER_APP_URL,
      onesignalAppId: process.env.ONESIGNAL_APP_ID,
      keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE_URL,
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        redirectUrl: process.env.KEYCLOAK_REDIRECT_URL,
        logoutUrl: process.env.KEYCLOAK_LOGOUT_URL,
      },
      vpvLicenseKey: process.env.NUXT_VPV_LICENSE_KEY || "",
    },
    vpvLicenseKey: process.env.NUXT_VPV_LICENSE_KEY || "",
  },
  build: {
    transpile: [
      (ctx) => (ctx.isServer ? "pdfjs-dist" : false),
      (ctx) => (ctx.isServer ? "@vue-pdf-viewer/viewer" : false),
      (ctx) => (ctx.isServer ? "@vue-pdf-viewer/annotation" : false),
    ],
  },
  vite: {
    optimizeDeps: {
      include: ["pdfjs-dist"],
      exclude: ["@vue-pdf-viewer/viewer", "@vue-pdf-viewer/annotation"],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      globIgnores: ["**/OneSignalSDKWorker.js"],
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
