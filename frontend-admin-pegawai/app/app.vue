<script setup>
const toaster = { duration: 3000, position: "top-right" };

// Dashboard Meta Tags
useHead({
  title: "Kementerian Haji dan Umrah Dashboard",
  meta: [
    {
      name: "description",
      content:
        "Dashboard Admin Kementerian Haji dan Umrah untuk presensi & kepegawaian",
    },
    { name: "theme-color", content: "#019eab" },
    { property: "og:title", content: "BPHJ" },
    {
      property: "og:description",
      content:
        "Dashboard Admin Kementerian Haji dan Umrah untuk presensi & kepegawaian",
    },
    { property: "og:type", content: "website" },
  ],
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/images/logo.png" },
  ],
});

// Notification Permission
useNotificationPermission();
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLayout> <NuxtPage /> </NuxtLayout>
  </UApp>
</template>
