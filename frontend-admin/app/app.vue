<script setup>
const toaster = { duration: 3000, position: "top-right" };

// Dashboard Meta Tags
useHead({
  title: "Kementerian Haji dan Umrah Dashboard",
  meta: [
    {
      name: "description",
      content:
        "Dashboard Admin Kementerian Haji dan Umrah untuk kepegawaian dan persuratan",
    },
    { name: "theme-color", content: "#019eab" },
    { property: "og:title", content: "Haji Admin Dashboard" },
    {
      property: "og:description",
      content:
        "Dashboard Admin Kementerian Haji dan Umrah untuk kepegawaian dan persuratan",
    },
    { property: "og:type", content: "website" },
  ],
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/icons/icon-192x192.svg" },
  ],
});

// Notification Permission
useNotificationPermission();
</script>

<template>
  <UApp :toaster="toaster">    
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
