<script setup>
const route = useRoute();
const currentRoute = computed(() => route.path);

const bottomMenu = [
  {
    id: "Beranda",
    name: "Beranda",
    icon: "ph:house",
    to: "/",
  },
  {
    id: "Call Center",
    name: "Call Center",
    icon: "ph:headset",
    to: "https://wa.me/999999999999999",
  },
  {
    id: "Berita",
    name: "Berita",
    icon: "ph:newspaper-clipping",
    to: "/berita",
  },
  {
    id: "Notifikasi",
    name: "Notifikasi",
    icon: "ph:bell-ringing",
    to: "/notifikasi",
  },
  {
    id: "Akun",
    name: "Akun",
    icon: "ph:user-circle",
    to: "/akun",
  },
];

const isActive = (id) => {
  return currentRoute.value === id;
};
</script>

<template>
  <div
    class="fixed bottom-0 left-1/2 flex h-[70px] w-full max-w-[1027px] -translate-x-1/2 items-center bg-white px-4 py-3 shadow-[0px_-4px_10px_0px_#8484841A]"
  >
    <NuxtLink
      v-for="menu in bottomMenu"
      :key="menu.id"
      class="flex flex-1 flex-col items-center justify-center gap-2"
      :to="menu.to"
    >
      <UIcon
        :name="menu.icon"
        :class="isActive(menu.to) ? 'text-primary-main' : 'text-gray-4'"
        class="h-6 w-6"
      />
      <span
        :class="isActive(menu.to) ? 'text-primary-main' : 'text-gray-4'"
        class="text-xs"
        >{{ menu.name }}</span
      >
    </NuxtLink>
  </div>
</template>
