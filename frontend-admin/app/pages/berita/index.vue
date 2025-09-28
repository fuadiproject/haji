<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      title="Berita"
      @back="handleBack"
    >
      Berita
    </TemplateDetailComponent>
    <BottomMenuComponent />
  </div>
</template>
