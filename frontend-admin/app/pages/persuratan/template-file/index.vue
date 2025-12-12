<script setup>
definePageMeta({
  title: "Daftar Template File",
  description: "Kelola data template file",
});

const toast = useToast();

const persuratanApi = useServicePersuratanApi();
const { downloadFileById } = persuratanApi;

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const isEditMode = ref(false);

// Form data
const formData = ref({
  file: {
    files: null,
    preview: null,
  },
  nama: "",
  kategori: "",
  deskripsi: "",
});

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus template file "${itemToDelete.value.nama || itemToDelete.value.name || itemToDelete.value.file || "Template File"}"?`
    : "Apakah Anda yakin ingin menghapus template file ini?";
});

// Loading state
const isLoadingTemplateFile = ref(true);

// Correct implementation - fetch from backend
const {
  data: allTemplateFileData,
  refresh: refreshTemplateFile,
  status,
} = await useAsyncData(
  "template-file",
  async () => {
    isLoadingTemplateFile.value = true;
    try {
      const result = await persuratanApi.getAllTemplateFile();
      return result;
    } finally {
      isLoadingTemplateFile.value = false;
    }
  },
  {
    default: () => [],
    transform: (data) => data?.data || [],
    server: false,
    lazy: true,
  },
);

// Watch status for initial load and updates
watch(
  status,
  (newStatus) => {
    isLoadingTemplateFile.value = newStatus === "pending";
  },
  { immediate: true },
);

// Table columns configuration
const columns = [
  {
    key: "file",
    label: "Nama Template File",
    width: "40%",
  },
  {
    key: "createdAt",
    label: "Dibuat Pada",
    width: "20%",
  },
  {
    key: "updatedAt",
    label: "Diperbarui Pada",
    width: "20%",
  },
  {
    key: "createdBy",
    label: "Dibuat Oleh",
    width: "15%",
  },
  {
    key: "actions",
    label: "Aksi",
    width: "5%",
  },
];

// Pagination configuration
const paginationConfig = ref({
  enabled: true,
  currentPage: 1,
  itemsPerPage: 5,
  showItemsPerPage: true,
  showPaginationInfo: true,
  itemsPerPageOptions: [
    { label: "5 per halaman", value: 5 },
    { label: "10 per halaman", value: 10 },
    { label: "20 per halaman", value: 20 },
    { label: "50 per halaman", value: 50 },
  ],
});

// Format date to Indonesian format
const formatDate = (date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Form validation
const validateForm = () => {
  const errors = {};

  // Validate file for add mode
  if (isEditMode.value === false) {
    if (
      !formData.value.file.files ||
      (Array.isArray(formData.value.file.files) &&
        formData.value.file.files.length === 0)
    ) {
      errors.file = "File template wajib diunggah";
    }
  }

  if (!formData.value.nama.trim()) {
    errors.nama = "Nama template wajib diisi";
  }

  if (!formData.value.kategori.trim()) {
    errors.kategori = "Kategori wajib diisi";
  }

  if (!formData.value.deskripsi.trim()) {
    errors.deskripsi = "Deskripsi wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    file: {
      files: null,
      preview: null,
    },
    nama: "",
    kategori: "",
    deskripsi: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddTemplateFile = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEditTemplateFile = (item) => {
  isEditMode.value = true;
  itemToEdit.value = item;

  // Extract file URL from file object or direct URL
  let fileUrl = null;
  let fileName = null;

  if (item?.file) {
    if (typeof item.file === "string") {
      // If file is a string URL
      fileUrl = item.file;
    } else if (item.file?.filepath) {
      // If file is an object with filepath
      fileUrl = item.file.filepath;
      fileName = item.file.filename;
    } else if (item.file?.downloadUrl) {
      // If file is an object with downloadUrl
      fileUrl = item.file.downloadUrl;
      fileName = item.file.filename;
    } else if (item.file?.url) {
      // If file is an object with url
      fileUrl = item.file.url;
      fileName = item.file.filename;
    }
  } else if (item?.file_url) {
    fileUrl = item.file_url;
  }

  formData.value = {
    file: {
      files: null,
      preview: fileUrl,
      filename: fileName,
    },
    nama: item?.nama || "",
    kategori: item?.kategori || "",
    deskripsi: item?.deskripsi || "",
  };
  formErrors.value = {};
  isModalOpen.value = true;
};

const handleSaveTemplateFile = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    if (isEditMode.value) {
      // Edit mode: upload new file only if provided
      let fileId = null;

      // Upload file if a new one is selected
      if (formData.value.file.files != null) {
        const form = new FormData();
        // Handle both array and single file object
        const fileToUpload = Array.isArray(formData.value.file.files)
          ? formData.value.file.files[0]
          : formData.value.file.files;
        form.append("file", fileToUpload);

        const fileResponse = await persuratanApi.createFile(form);
        if (!fileResponse.success) {
          toast.add({
            title: `Gagal Mengupload File. ${fileResponse.message}`,
            description: fileResponse.message,
            color: "error",
          });
          return;
        }
        fileId = fileResponse.data.id;
      }

      const payload = {
        nama: formData.value.nama.trim(),
        kategori: formData.value.kategori.trim(),
        deskripsi: formData.value.deskripsi.trim(),
      };

      // Only include file_id if a new one was uploaded
      if (fileId !== null) {
        payload.file_id = fileId;
      }

      const updateResponse = await persuratanApi.updateTemplateFile(
        itemToEdit.value.id,
        payload,
      );

      if (!updateResponse.success) {
        toast.add({
          title: `Gagal Mengupdate Template File. ${updateResponse.message}`,
          description: updateResponse.message,
          color: "error",
        });
        return;
      }

      isLoadingTemplateFile.value = true;
      await refreshTemplateFile();
      isLoadingTemplateFile.value = false;

      toast.add({
        title: "Berhasil",
        description: "Template file berhasil diubah",
        color: "success",
      });
    } else {
      // Add mode: file is required
      // Upload file
      const form = new FormData();
      // Handle both array and single file object
      const fileToUpload = Array.isArray(formData.value.file.files)
        ? formData.value.file.files[0]
        : formData.value.file.files;
      form.append("file", fileToUpload);

      const fileResponse = await persuratanApi.createFile(form);
      if (!fileResponse.success) {
        toast.add({
          title: `Gagal Mengupload File. ${fileResponse.message}`,
          description: fileResponse.message,
          color: "error",
        });
        return;
      }

      const payload = {
        file_id: fileResponse.data.id,
        nama: formData.value.nama.trim(),
        kategori: formData.value.kategori.trim(),
        deskripsi: formData.value.deskripsi.trim(),
      };

      const createResponse = await persuratanApi.createTemplateFile(payload);
      if (!createResponse.success) {
        toast.add({
          title: `Gagal Menambahkan Template File. ${createResponse.message}`,
          description: createResponse.message,
          color: "error",
        });
        return;
      }

      isLoadingTemplateFile.value = true;
      await refreshTemplateFile();
      isLoadingTemplateFile.value = false;

      toast.add({
        title: "Berhasil",
        description: "Template file berhasil ditambahkan",
        color: "success",
      });
    }

    isModalOpen.value = false;
    resetForm();
    itemToEdit.value = null;
    isEditMode.value = false;
  } catch (error) {
    toast.add({
      title: "Error",
      description: error.message || "Terjadi kesalahan saat menyimpan data",
      color: "error",
    });
  }
};

const handleCancelModal = () => {
  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;
};

const handleDeleteTemplateFile = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    try {
      const deleteResponse = await persuratanApi.deleteTemplateFile(
        itemToDelete.value.id,
      );

      if (!deleteResponse.success) {
        toast.add({
          title: `Gagal Menghapus Template File. ${deleteResponse.message}`,
          description: deleteResponse.message,
          color: "error",
        });
        return;
      }

      isLoadingTemplateFile.value = true;
      await refreshTemplateFile();
      isLoadingTemplateFile.value = false;

      toast.add({
        title: "Berhasil",
        description: "Template file berhasil dihapus",
        color: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menghapus data",
        color: "error",
      });
    }
  }
  handleCancelDelete();
};

const handleCancelDelete = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

// Table event handlers
const handlePaginationUpdate = (newPagination) => {
  paginationConfig.value = { ...newPagination };
};

const handleRowClick = ({ row, index }) => {
  console.log("Row clicked:", row, index);
  // TODO: Implement row click functionality if needed
};

const handleDownloadFile = async (row) => {
  try {
    // Get file ID from row - could be file_id, file.id, or file
    const fileId = row.file_id || row.file?.id || row.file;

    if (!fileId) {
      toast.add({
        title: "Error",
        description: "File ID tidak ditemukan",
        color: "error",
      });
      return;
    }

    const response = await downloadFileById(fileId);

    if (!response.success || !response.data?.downloadUrl) {
      toast.add({
        title: "Error",
        description: response.message || "Gagal mendapatkan URL download",
        color: "error",
      });
      return;
    }

    // Get download URL and filename from response
    const downloadUrl = response.data.downloadUrl;
    const filename =
      response.data.filename || row.nama || row.name || "template-file";

    // Create download link
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank"; // Open in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.add({
      title: "Berhasil",
      description: "File berhasil diunduh",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: error.message || "Gagal mengunduh file",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">List Template File</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddTemplateFile"
        >
          Tambah Template File
        </UButton>
      </div>
    </div>
    <!-- Data Table -->
    <DataTableComponent
      :data="allTemplateFileData"
      :columns="columns"
      :pagination="paginationConfig"
      :loading="isLoadingTemplateFile"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for file column -->
      <template #file-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="group bg-primary-50 hover:bg-primary-100 relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all duration-200"
            title="Klik untuk mengunduh file"
            @click="handleDownloadFile(row)"
          >
            <UIcon
              name="ph:file"
              class="text-primary-600 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
            />
            <UIcon
              name="ph:download"
              class="text-primary-600 absolute h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">
              {{ row.nama || row.name || row.file_name || "Template File" }}
            </span>
            <span v-if="row.kategori" class="text-xs text-gray-500">
              Kategori: {{ row.kategori }}
            </span>
            <span v-if="row.file_url" class="text-xs text-gray-500">
              {{ row.file_url }}
            </span>
          </div>
        </div>
      </template>
      <!-- Custom slot for createdAt column -->
      <template #createdAt-data="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.created_at) }}
        </span>
      </template>
      <!-- Custom slot for updatedAt column -->
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.updated_at) }}
        </span>
      </template>
      <!-- Custom slot for createdBy column -->
      <template #createdBy-data="{ row }">
        <div v-if="row.creator" class="flex items-center gap-2">
          <div
            class="bg-primary-100 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <UIcon name="ph:user" class="text-primary-600 h-3 w-3" />
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ row.creator?.nama }}
          </span>
        </div>
        <div v-else class="text-sm font-medium text-gray-700">-</div>
      </template>
      <!-- Custom slot for actions column -->
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleEditTemplateFile(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteTemplateFile(row)"
          />
        </div>
      </template>
    </DataTableComponent>
    <!-- Template File Modal (Create/Edit) -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="isEditMode ? 'Edit Template File' : 'Tambah Template File Baru'"
      size="lg"
      @close="handleCancelModal"
    >
      <form class="space-y-6" @submit.prevent="handleSaveTemplateFile">
        <!-- Nama Template Field -->
        <div>
          <label
            for="nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Template <span class="text-red-500">*</span>
          </label>
          <UInput
            id="nama"
            v-model="formData.nama"
            type="text"
            placeholder="Masukkan nama template, contoh: Template Surat Tugas"
            size="lg"
            :color="formErrors.nama ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.nama" class="mt-1 text-sm text-red-600">
            {{ formErrors.nama }}
          </p>
        </div>

        <!-- Kategori Field -->
        <div>
          <label
            for="kategori"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Kategori <span class="text-red-500">*</span>
          </label>
          <UInput
            id="kategori"
            v-model="formData.kategori"
            type="text"
            placeholder="Masukkan kategori, contoh: ST"
            size="lg"
            :color="formErrors.kategori ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.kategori" class="mt-1 text-sm text-red-600">
            {{ formErrors.kategori }}
          </p>
        </div>

        <!-- Deskripsi Field -->
        <div>
          <label
            for="deskripsi"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Deskripsi <span class="text-red-500">*</span>
          </label>
          <UTextarea
            id="deskripsi"
            v-model="formData.deskripsi"
            placeholder="Masukkan deskripsi template, contoh: Template untuk surat tugas dinas luar"
            size="lg"
            :color="formErrors.deskripsi ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.deskripsi" class="mt-1 text-sm text-red-600">
            {{ formErrors.deskripsi }}
          </p>
        </div>

        <!-- File Upload Field -->
        <div>
          <label
            for="file"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            File Template <span class="text-red-500">*</span>
          </label>

          <!-- Preview existing file in edit mode -->
          <div
            v-if="
              isEditMode && formData.file.preview && formData.file.files == null
            "
            class="mb-3"
          >
            <div class="rounded-lg border border-gray-300 bg-gray-50 p-4">
              <div class="flex items-center gap-3">
                <UIcon name="ph:file" class="text-primary-600 h-6 w-6" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">File saat ini</p>
                  <a
                    :href="formData.file.preview"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs break-all text-blue-600 hover:underline"
                  >
                    {{ formData.file.filename || formData.file.preview }}
                  </a>
                  <p
                    v-if="
                      formData.file.filename &&
                      formData.file.preview !== formData.file.filename
                    "
                    class="mt-1 text-xs break-all text-gray-500"
                  >
                    {{ formData.file.preview }}
                  </p>
                </div>
              </div>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Pilih file baru untuk mengganti file yang ada
            </p>
          </div>

          <UFileUpload
            v-model="formData.file.files"
            accept="*/*"
            :max-files="1"
            :max-size="10000000"
            :label="
              isEditMode ? 'Pilih file baru (opsional)' : 'Pilih file template'
            "
            :description="
              isEditMode
                ? 'Format: Semua format file (maks. 10MB)'
                : 'Format: Semua format file (maks. 10MB) *Wajib'
            "
            :color="formErrors.file ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.file" class="mt-1 text-sm text-red-600">
            {{ formErrors.file }}
          </p>
        </div>
      </form>
      <!-- Modal Footer -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            type="button"
            color="gray"
            variant="soft"
            size="lg"
            @click="handleCancelModal"
          >
            Batal
          </UButton>
          <UButton
            type="button"
            color="primary"
            size="lg"
            @click="handleSaveTemplateFile"
          >
            {{ isEditMode ? "Simpan Perubahan" : "Simpan Template File" }}
          </UButton>
        </div>
      </template>
    </ModalComponent>
    <!-- Delete Confirmation Modal -->
    <ModalConfirmComponent
      v-model:is-open="isDeleteModalOpen"
      title="Konfirmasi Hapus"
      :message="deleteModalMessage"
      :buttons="[
        {
          variant: 'primary',
          text: 'Hapus',
        },
        {
          variant: 'secondary',
          text: 'Batal',
        },
      ]"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
      @close="handleCancelDelete"
    >
      <div class="text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
        >
          <UIcon name="ph:trash" class="h-6 w-6 text-red-600" />
        </div>

        <p class="text-gray-600">
          Data yang dihapus tidak dapat dikembalikan. Pastikan Anda yakin dengan
          keputusan ini.
        </p>
      </div>
    </ModalConfirmComponent>
  </div>
</template>
