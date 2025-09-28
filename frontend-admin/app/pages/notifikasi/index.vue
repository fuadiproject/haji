<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      title="Notifikasi"
      @back="handleBack"
    >
      Notifikasi
    </TemplateDetailComponent>
    <BottomMenuComponent />
  </div>
</template>
