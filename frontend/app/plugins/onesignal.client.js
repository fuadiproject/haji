import OneSignalVuePlugin from "@onesignal/onesignal-vue3";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(OneSignalVuePlugin, {
    appId: config.public.onesignalAppId,
    allowLocalhostAsSecureOrigin: true,
  });

  // Provide OneSignal to the Nuxt app context
  return {
    provide: {
      OneSignal: nuxtApp.vueApp.config.globalProperties.$OneSignal,
    },
  };
});
