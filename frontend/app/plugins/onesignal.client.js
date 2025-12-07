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

  try {
    await nuxtApp.vueApp.use(OneSignalVuePlugin, {
      appId: config.public.onesignalAppId,
      allowLocalhostAsSecureOrigin: true,
    });
    console.log("OneSignal initialized successfully");
  } catch (error) {
    console.error("Error initializing OneSignal:", error);
  }

  // Provide OneSignal to the Nuxt app context
  return {
    provide: {
      OneSignal: nuxtApp.vueApp.config.globalProperties.$OneSignal,
    },
  };
});
