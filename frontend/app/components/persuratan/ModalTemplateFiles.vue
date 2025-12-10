<script setup>
import ModalComponent from "@/components/global/ModalComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update:isOpen"]);

const toast = useToast();
const suratApiService = useServiceSuratapi();

const templates = ref([]);
const isLoading = ref(false);
const selectedKategori = ref(undefined);
const downloadingFileIds = ref(new Set());

const kategoriOptions = [
  { label: "Semua Kategori", value: undefined },
  { label: "Surat Tugas", value: "ST" },
  { label: "Keputusan Kepala", value: "KEPKA" },
  { label: "Surat Keputusan", value: "SK" },
  { label: "Surat Undangan", value: "UNDANGAN" },
  { label: "Nota Dinas", value: "NOTA_DINAS" },
];

const fetchTemplates = async () => {
  try {
    isLoading.value = true;
    const response = await suratApiService.getTemplateFiles({
      kategori: selectedKategori.value,
    });
    if (response.success) {
      templates.value = response.data || [];
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal memuat template files",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleDownload = async (fileId, filename) => {
  if (downloadingFileIds.value.has(fileId)) {
    return; // Prevent multiple downloads
  }

  try {
    downloadingFileIds.value.add(fileId);
    const blob = await suratApiService.verifyFile({ fileId });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `template_${fileId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.add({
      title: "Success",
      description: "File berhasil didownload",
      color: "success",
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal mendownload file",
      color: "error",
    });
  } finally {
    downloadingFileIds.value.delete(fileId);
  }
};

const handleClose = () => {
  selectedKategori.value = undefined;
  emit("close");
  emit("update:isOpen", false);
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchTemplates();
    }
  },
  { immediate: true },
);

watch(selectedKategori, () => {
  if (props.isOpen) {
    fetchTemplates();
  }
});
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    title="Template Files"
    size="lg"
    @close="handleClose"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div class="space-y-4">
      <!-- Filter Kategori -->
      <UFormField label="Filter Kategori">
        <USelectMenu
          v-model="selectedKategori"
          :items="kategoriOptions"
          value-key="value"
          placeholder="Pilih kategori"
          class="w-full"
        />
      </UFormField>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <UProgress :model-value="50" :max="100" class="w-full" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="templates.length === 0"
        class="flex flex-col items-center justify-center py-8"
      >
        <div class="mb-4 text-6xl">📄</div>
        <p class="text-sm text-gray-500">Tidak ada template files</p>
      </div>

      <!-- Template List -->
      <div v-else class="max-h-[60vh] space-y-3 overflow-y-auto">
        <div
          v-for="template in templates"
          :key="template.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ template.nama }}</h4>
            <p class="mt-1 text-sm text-gray-500">
              {{ template.deskripsi || "-" }}
            </p>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {{ template.kategori }}
              </span>
              <span v-if="template.file" class="text-xs text-gray-500">
                {{ (template.file.size / 1024).toFixed(2) }} KB
              </span>
            </div>
          </div>
          <UButton
            v-if="template.file"
            color="primary"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-down-tray"
            :loading="downloadingFileIds.has(template.file.id)"
            :disabled="downloadingFileIds.has(template.file.id)"
            @click="handleDownload(template.file.id, template.file.filename)"
          >
            Download
          </UButton>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>
