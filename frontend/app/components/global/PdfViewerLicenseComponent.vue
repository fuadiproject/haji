<script setup>
import { useLicense } from "@vue-pdf-viewer/viewer";
const config = useRuntimeConfig();
onBeforeMount(() => {
  console.log("config.public.vpvLicenseKey : ", config.public.vpvLicenseKey);
  if (config.public.vpvLicenseKey) {
    useLicense(config.public.vpvLicenseKey);
  }
});
</script>
<template><slot /></template>
