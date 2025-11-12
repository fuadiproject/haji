<script setup>
// import { useLicense } from "@vue-pdf-viewer/viewer";
const props = defineProps({
  licenseKey: {
    type: String,
    default: "",
  },
});
onBeforeMount(() => {
  if (props.licenseKey) {
    // useLicense(props.licenseKey);
  }
});
</script>
<template><slot /></template>
