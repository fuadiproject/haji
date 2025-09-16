<script setup>
const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div>
    <TemplateDetailComponent variant="default" title="Akun" @back="handleBack">
      Akun
    </TemplateDetailComponent>
    <BottomMenuComponent />
  </div>
</template>
