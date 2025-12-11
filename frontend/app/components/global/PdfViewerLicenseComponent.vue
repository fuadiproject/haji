<script setup>
import { useLicense } from "@vue-pdf-viewer/viewer";
const config = useRuntimeConfig();
onBeforeMount(() => {
  if (config.public.vpvLicenseKey) {
    useLicense(config.public.vpvLicenseKey);
  }
});
</script>
<template><slot /></template>
