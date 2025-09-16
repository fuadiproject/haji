<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent
    variant="default"
    title="Kepegawaian"
    @back="handleBack"
  >
    Kepegawaian
  </TemplateDetailComponent>
</template>
