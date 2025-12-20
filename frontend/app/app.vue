<script setup>
//
import { useTheme } from "@/composables/useTheme";
import { isAuthenticated, jwtInfo } from "@/composables/useAuth";
import { useOneSignalListener } from "@/composables/useOneSignalListener";

const toaster = { duration: 3000, position: "top-right" };

const { isOneSignalReady, loginOneSignal, subscribe } = useOneSignal();

// Initialize OneSignal listeners (sets up subscription & permission change handlers)
// This will automatically call loginOneSignal when user accepts notification prompt
useOneSignalListener();

watch(
  () => isAuthenticated.value,
  async (isLoggedIn) => {
    if (!isOneSignalReady()) return;

    if (isLoggedIn) {
      const userId = jwtInfo.value?.nik;
      // FOR NOW WE WILL ALWAYS LOGIN THE USER AND SUBSCRIBE TO THE NOTIFICATIONS
      if (userId) {
        await loginOneSignal(userId);
        await subscribe();
      }

      // USE THIS IF YOU WANT TO ASK PERMISSION
      // const isExternalId = await isUserHaveExternalId();
      // console.log("is user have external id", isExternalId);
      // if (!isExternalId) {
      //   console.log("promptPush");
      //   await promptPush();
      // } else {

      //   const userId = jwtInfo.value?.sub;
      //   if (userId) {
      //     await loginOneSignal(userId);
      //     await subscribe();
      //   }
      // }
    }
  },
  { immediate: true },
);

// PWA Meta Tags
useHead({
  title: "Kementerian Haji dan Umrah App",
  meta: [
    {
      name: "description",
      content:
        "Aplikasi Kementerian Haji dan Umrah untuk kepegawaian dan persuratan",
    },
    { name: "theme-color", content: "#3B82F6" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: "Haji App" },
    { name: "msapplication-TileColor", content: "#3B82F6" },
    { name: "msapplication-config", content: "/browserconfig.xml" },
    { property: "og:title", content: "Haji App" },
    {
      property: "og:description",
      content:
        "Aplikasi Kementerian Haji dan Umrah untuk kepegawaian dan persuratan",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/icons/icon-192x192.svg" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Haji App" },
    {
      name: "twitter:description",
      content:
        "Aplikasi Kementerian Haji dan Umrah untuk kepegawaian dan persuratan",
    },
    { name: "twitter:image", content: "/icons/icon-192x192.svg" },
  ],
  link: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/icons/icon-192x192.svg",
    },
    { rel: "icon", type: "image/svg+xml", href: "/icons/icon-192x192.svg" },
    { rel: "manifest", href: "/manifest.json" },
  ],
});

// Theme
useTheme();
</script>

<template>
  <UApp :toaster="toaster">
    <AuthLoaderComponent />
    <!-- <ServiceWorkerStatusComponent /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
