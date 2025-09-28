<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <TemplateDetailComponent variant="default" title="SOP" @back="handleBack">
    SOP
  </TemplateDetailComponent>
</template>
