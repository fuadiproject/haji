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
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiBphUrl: process.env.API_BPH_URL,
      apiMasterDataUrl: process.env.API_MASTER_DATA_URL,
      apiSuperAppUrl: process.env.API_SUPER_APP_URL,
      keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE_URL,
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        redirectUrl: process.env.KEYCLOAK_REDIRECT_URL,
        logoutUrl: process.env.KEYCLOAK_LOGOUT_URL,
      },
    },
  },
});
