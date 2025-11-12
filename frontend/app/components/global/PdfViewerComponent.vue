<script setup>
import { VPdfViewer } from "@vue-pdf-viewer/viewer";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

const props = defineProps({
  toolbarOptions: {
    type: Boolean,
    default: true,
  },
  src: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div v-if="src">
    <ClientOnly>
      <PdfViewerLicenseComponent>
        <VPdfViewer :src="src" :worker-url="pdfWorker" v-bind="props" />
      </PdfViewerLicenseComponent>
    </ClientOnly>
  </div>
  <div v-else>
    <p>No src provided</p>
  </div>
</template>
