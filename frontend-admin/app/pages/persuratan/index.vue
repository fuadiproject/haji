<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent
    is-full-width
    variant="default"
    title="Persuratan"
    @back="handleBack"
  >
    Persuratan
  </TemplateDetailComponent>
</template>
