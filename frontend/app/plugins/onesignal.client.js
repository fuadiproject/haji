import OneSignalVuePlugin from "@onesignal/onesignal-vue3";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  // Only initialize if appId is provided
  if (!config.public.onesignalAppId) {
    console.warn("OneSignal App ID is not configured");
    return {
      provide: {
        OneSignal: null,
      },
    };
  }

  nuxtApp.vueApp.use(OneSignalVuePlugin, {
    appId: config.public.onesignalAppId,
    allowLocalhostAsSecureOrigin: true,
  });

  // Wait for next tick to ensure OneSignal is initialized
  await nextTick();

  // Provide OneSignal to the Nuxt app context
  // Use a getter function to ensure we always get the latest instance
  return {
    provide: {
      OneSignal: nuxtApp.vueApp.config.globalProperties.$OneSignal,
    },
  };
});
