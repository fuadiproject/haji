<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent
    variant="not-default"
    title="Presensi"
    @back="handleBack"
  >
    Presensi
  </TemplateDetailComponent>
</template>
