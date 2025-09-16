<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent
    variant="default"
    title="Persuratan"
    @back="handleBack"
  >
    Persuratan
  </TemplateDetailComponent>
</template>
