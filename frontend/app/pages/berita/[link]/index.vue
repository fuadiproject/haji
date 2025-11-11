<script setup>
const route = useRoute();
const referenceUrl = ref(route.query.referenceUrl || "");
const title = ref(route.query.title || "Detail Berita");

const handleBack = () => {
  navigateTo("/berita");
};
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      :title="title"
      @back="handleBack"
    >
      <div class="flex h-full w-full flex-col items-center justify-center p-4">
        <div v-if="referenceUrl" class="text-center">
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Konten berita ini tidak dapat ditampilkan langsung di dalam aplikasi
            karena kebijakan keamanan dari situs sumber.
          </p>
          <a
            :href="referenceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block rounded-lg bg-yellow-600 px-5 py-3 text-sm font-medium text-white hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 focus:outline-none dark:focus:ring-yellow-800"
          >
            Baca Berita di Sumber Asli
          </a>
        </div>
        <div v-else class="p-4">
          <p>URL referensi tidak ditemukan.</p>
        </div>
      </div>
    </TemplateDetailComponent>
  </div>
</template>
