<script setup>
const toaster = { duration: 3000, position: "top-right" };

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

// Notification Permission
useNotificationPermission();
</script>

<template>
  <UApp :toaster="toaster">
    <AuthLoaderComponent />
    <ServiceWorkerStatusComponent />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
