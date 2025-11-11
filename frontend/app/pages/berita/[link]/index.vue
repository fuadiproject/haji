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
      <div class="flex h-full w-full flex-col">
        <div v-if="referenceUrl" class="h-[calc(100vh-115px)] w-full">
          <iframe
            :src="referenceUrl"
            class="h-[calc(100vh-130px)] w-full rounded-lg border border-gray-300 dark:border-gray-700"
            frameborder="0"
            allowfullscreen
            loading="lazy"
          />
        </div>
        <div v-else class="flex h-full w-full items-center justify-center p-4">
          <p class="text-gray-700 dark:text-gray-300">
            URL referensi tidak ditemukan.
          </p>
        </div>
      </div>
    </TemplateDetailComponent>
  </div>
</template>
