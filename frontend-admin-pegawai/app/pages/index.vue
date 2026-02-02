<script setup>
definePageMeta({
  title: "Dashboard",
});

const { user } = useAuth();

const roleLabel = computed(() => {
  return user.value?.role === "admin_pusat" ? "Admin Pusat" : "Admin Satker";
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="from-primary-main to-primary-main/80 rounded-lg bg-gradient-to-r p-6 text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Selamat Datang, {{ user?.username }}!</h1>
          <p class="mt-1 text-white/80">{{ roleLabel }} - {{ user?.nama_satker }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
