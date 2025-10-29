<script setup>
const toast = useToast();
const suratApiService = useServiceSuratapi();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "View File",
  },
  fileId: {
    type: String,
    default: "",
  },
  suratId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "update:isOpen", "refresh"]);

const handleClose = () => {
  emit("close");
  emit("update:isOpen", false);
};

const fileUrl = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const isLoadingSign = ref(false);

const form = reactive({
  passphrase: "",
});

const { data: suratData, status: statusSurat } = await useAsyncData(
  computed(() => `surat-${props.type}-${props.suratId}`),
  async () => {
    const response = await suratApiService.getSuratKeluarById({
      id: props.suratId,
    });
    return response;
  },
  {
    watch: [props.suratId],
    server: false,
    lazy: true,
    immediate: !!props.suratId,
  },
);
const isLoadingSurat = computed(() => statusSurat.value === "pending");

const jenisSign = computed(() => {
  if (suratData.value?.data?.urutan_tte) {
    const urutanTte = suratData.value?.data?.urutan_tte - 1;

    const tteLog = suratData.value?.data?.tteLogs[urutanTte];
    return tteLog?.jenis || "TTE";
  }
  return "PARAF";
});

const idSign = computed(() => {
  if (suratData.value?.data?.urutan_tte) {
    const urutanTte = suratData.value?.data?.urutan_tte - 1;
    return suratData.value?.data?.tteLogs[urutanTte]?.id;
  }
  return null;
});

const loadFile = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    if (!props.fileId) {
      throw new Error("File ID tidak ditemukan");
    }

    const response = await suratApiService.downloadFile({
      fileId: props.fileId,
    });

    // if (!response?.data?.downloadUrl) {
    //   throw new Error("URL file tidak ditemukan");
    // }

    fileUrl.value = response.data.downloadUrl;
  } catch (error) {
    console.error("Error loading file:", error);
    hasError.value = true;
    errorMessage.value =
      error.message ||
      error?.data?.error ||
      "Terjadi kesalahan saat memuat file";
  } finally {
    isLoading.value = false;
  }
};

const handleObjectError = () => {
  hasError.value = true;
  errorMessage.value = "File tidak dapat dibuka atau format tidak didukung";
};

const retryLoad = () => {
  loadFile();
};

const downloadFile = () => {
  if (!fileUrl.value) {
    console.error("File URL tidak tersedia untuk download");
    return;
  }

  try {
    // Membuat elemen anchor untuk download
    const link = document.createElement("a");
    link.href = fileUrl.value;
    link.download = `file_${props.fileId}`; // Nama file dengan ID sebagai fallback
    link.target = "_blank";

    // Menambahkan ke DOM, klik, dan hapus
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    // Fallback: buka di tab baru
    window.open(fileUrl.value, "_blank");
  }
};

const handleSign = async () => {
  try {
    isLoadingSign.value = true;
    await suratApiService.updateTTESign({
      id: idSign.value,
      data: {
        passphrase: form.passphrase,
      },
    });
    toast.add({
      title: "Success",
      description: `Berhasil ${jenisSign.value} surat`,
      color: "success",
    });
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Error signing:", error?.data?.error);

    toast.add({
      title: "Error",
      description: error?.data?.error || `Gagal ${jenisSign.value} surat`,
      color: "error",
    });
  } finally {
    isLoadingSign.value = false;
  }
};

onMounted(() => {
  if (props.fileId) {
    loadFile();
  }
});

watch(
  () => props.fileId,
  (newFileId) => {
    if (newFileId && props.isOpen) {
      loadFile();
    }
  },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.fileId) {
      loadFile();
    }
  },
);
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="title"
    size="xl"
    @close="handleClose"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex h-80 flex-col items-center justify-center gap-4"
    >
      <UProgress :model-value="50" :max="100" class="w-full" />
      <p class="text-body-5 text-center text-sm">Sedang memuat file...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="flex h-80 flex-col items-center justify-center gap-4"
    >
      <div class="text-center">
        <div class="mb-4 text-6xl text-red-500">⚠️</div>
        <h3 class="text-body-10 mb-2 text-lg font-semibold">
          Gagal Memuat File
        </h3>
        <p class="text-body-5 mb-4 text-center text-sm">{{ errorMessage }}</p>
        <UButton color="primary" variant="solid" size="sm" @click="retryLoad">
          Coba Lagi
        </UButton>
      </div>
    </div>

    <!-- Success State - File Display -->
    <div v-else-if="fileUrl" class="relative">
      <object
        class="h-[calc(100vh-340px)] w-full flex-grow object-contain"
        :data="fileUrl"
        type="application/pdf"
        @error="handleObjectError"
      >
        <!-- Fallback content jika object tidak bisa dimuat -->
        <div class="flex h-80 flex-col items-center justify-center gap-4">
          <div class="text-center">
            <div class="text-body-5 mb-4 text-6xl">📄</div>
            <h3 class="text-body-10 mb-2 text-lg font-semibold">
              File Tidak Dapat Ditampilkan
            </h3>
            <p class="mb-4 text-sm text-gray-600">
              Browser tidak mendukung preview file ini.
              <a
                :href="fileUrl"
                target="_blank"
                class="text-blue-600 underline hover:text-blue-800"
              >
                Klik di sini untuk membuka file
              </a>
            </p>
          </div>
        </div>
      </object>

      <!-- Passphrase Input -->
      <div class="mt-4 space-y-4">
        <div>
          <label class="text-body-1 mb-2 block text-sm font-medium">
            Passphrase
          </label>
          <UInput
            v-model="form.passphrase"
            type="password"
            placeholder="Masukkan passphrase"
            :disabled="isLoadingSign"
            class="w-full"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="secondary"
            variant="solid"
            size="md"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadFile"
          >
            Download File
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="md"
            :disabled="
              isLoadingSurat ||
              !suratData?.data ||
              !form.passphrase.trim() ||
              isLoadingSign
            "
            :loading="isLoadingSign"
            @click="handleSign"
          >
            <UIcon name="ph:signature-bold" class="h-4 w-4" />
            {{ jenisSign }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- No File State -->
    <div v-else class="flex h-80 flex-col items-center justify-center gap-4">
      <div class="text-center">
        <div class="text-body-5 mb-4 text-6xl">📁</div>
        <h3 class="text-body-10 mb-2 text-lg font-semibold">
          File Tidak Ditemukan
        </h3>
        <p class="text-body-5 text-center text-sm">
          Tidak ada file yang dapat ditampilkan
        </p>
      </div>
    </div>
  </ModalComponent>
</template>
