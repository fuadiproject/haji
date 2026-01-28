<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});

const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent
    is-full-width
    variant="default"
    :title="title"
    @back="handleBack"
  >
    <div
      class="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center"
    >
      <div class="text-center">
        <UIcon
          name="ph:clock-countdown-bold"
          class="mx-auto mb-6 h-24 w-24 text-gray-400"
        />
        <h1 class="mb-2 text-2xl font-semibold text-gray-700">Coming Soon</h1>
        <p class="text-gray-500">
          Fitur ini sedang dalam pengembangan dan akan segera hadir.
        </p>
      </div>
    </div>
  </TemplateDetailComponent>
</template>
