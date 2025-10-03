<script setup>
const { createFile, createBanner, getBanner, deleteBanner, updateBanner } =
  useServiceBphapi();
const toast = useToast();
const { formatDate } = useDateUtil();

definePageMeta({
  title: "Daftar Banner",
  description: "Kelola data banner dan panduan",
});

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isImageModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const selectedImage = ref(null);
const modalMode = ref("add");
const isUploadFileEditExist = ref(false);

// Form data
const formData = ref({
  judul: "",
  deskripsi: "",
  link: "",
  isActive: true,
  files: [],
});

const { data: allBannerData, refresh: refreshBanner } = await useAsyncData(
  "banner", // unique key for caching
  () => getBanner(), // function that returns a promise
  {
    default: () => [], // default value
    transform: (data) => data.data || [], // transform the data
    server: false, // run on server-side
    lazy: true, // don't block page rendering
  },
);

// Unified form handles both add and edit

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus banner "${itemToDelete.value.judul}"?`
    : "Apakah Anda yakin ingin menghapus banner ini?";
});

// Table columns configuration
const columns = [
  {
    key: "image",
    label: "Gambar",
    width: "20%",
  },
  {
    key: "title",
    label: "Judul",
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

// Form validation
const validateForm = () => {
  const errors = {};

  if (!formData.value.judul.trim()) {
    errors.judul = "Nama banner wajib diisi";
  }

  if (
    (!formData.value.files || formData.value.files.length === 0) &&
    modalMode.value == "add"
  ) {
    errors.files = "Gambar banner wajib diunggah";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    judul: "",
    deskripsi: "",
    link: "",
    isActive: true,
    files: [],
  };
  formErrors.value = {};
};

// Action handlers
const handleAddEditBanner = (type, item) => {
  handleCloseImageModal();
  if (type === "add") {
    modalMode.value = "add";
    itemToEdit.value = null;
    resetForm();
    isModalOpen.value = true;
    return;
  }

  if (type === "edit") {
    modalMode.value = "edit";
    itemToEdit.value = item;
    // Prefill unified form from selected item (fallbacks for optional fields)
    formData.value = {
      judul: item?.title || "",
      deskripsi: item?.description || "",
      link: item?.link || "",
      isActive: item?.isActive ?? true,
      files: [],
    };
    formErrors.value = {};
    isModalOpen.value = true;
    return;
  }

  if (type === "detail") {
    modalMode.value = "detail";
    itemToEdit.value = item;
    // Prefill to display in disabled fields
    formData.value = {
      judul: item?.title || "",
      deskripsi: item?.description || "",
      link: item?.link || "",
      isActive: item?.isActive ?? true,
      files: [],
    };
    formErrors.value = {};
    isModalOpen.value = true;
  }
};

const handleSaveBanner = async () => {
  if (!validateForm()) {
    return;
  }

  if (itemToEdit.value) {
    let keyFile = null;
    console.log("formData", formData.value);
    if (formData.value.files.length != 0) {
      const form = new FormData();
      form.append("file", formData.value.files);

      const fileResponse = await createFile(form);
      if (!fileResponse.success) {
        toast.add({
          title: `Gagal Mengupload File. ${fileResponse.message}`,
          description: fileResponse.message,
          color: "error",
        });
        return;
      }
      keyFile = fileResponse.data.key;
    }

    const payload = {
      title: formData.value.judul,
      image: keyFile,
      link: formData.value.link,
      description: formData.value.deskripsi,
      is_active: formData.value.isActive,
    };

    const bannerResponse = await updateBanner(itemToEdit.value.id, payload);
    if (!bannerResponse.success) {
      toast.add({
        title: `Gagal Mengupdate Banner. ${bannerResponse.message}`,
        description: bannerResponse.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Berhasil",
      description: "Banner berhasil diubah",
      color: "success",
    });
  } else {
    // upload the file
    const form = new FormData();
    form.append("file", formData.value.files);

    const fileResponse = await createFile(form);
    if (!fileResponse.success) {
      toast.add({
        title: `Gagal Mengupload File. ${fileResponse.message}`,
        description: fileResponse.message,
        color: "error",
      });
      return;
    }

    const payload = {
      title: formData.value.judul,
      image: fileResponse.data.key,
      link: formData.value.link,
      description: formData.value.deskripsi,
      is_active: formData.value.isActive,
    };

    const bannerResponse = await createBanner(payload);
    if (!bannerResponse.success) {
      toast.add({
        title: `Gagal Menambahkan Banner. ${bannerResponse.message}`,
        description: bannerResponse.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Berhasil",
      description: "Banner berhasil ditambahkan",
      color: "success",
    });
  }

  await refreshBanner();

  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  itemToEdit.value = null;
  resetForm();
};

const handleDeleteBanner = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    await deleteBanner(itemToDelete.value.id);
    await refreshBanner();
    toast.add({
      title: "Berhasil",
      description: "Banner berhasil dihapus",
      color: "success",
    });
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

// Handle image modal functionality
const handleViewImage = (item) => {
  selectedImage.value = item;
  isImageModalOpen.value = true;
};

const handleCloseImageModal = () => {
  isImageModalOpen.value = false;
  selectedImage.value = null;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">Daftar Banner</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddEditBanner('add')"
        >
          Tambah Banner
        </UButton>
      </div>
    </div>

    <!-- Data Table -->
    <DataTableComponent
      :data="allBannerData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for image column -->
      <template #image-data="{ row }">
        <div class="flex items-center justify-center">
          <div
            class="group relative cursor-pointer"
            @click="handleViewImage(row)"
          >
            <NuxtImg
              :src="row.image"
              :alt="row.judul"
              class="h-12 w-16 rounded-lg border border-gray-200 object-cover shadow-sm transition-all duration-200 group-hover:shadow-md"
              loading="lazy"
              placeholder
              :placeholder-class="'w-16 h-12 bg-gray-100 rounded-lg border border-gray-200'"
            />
            <!-- Overlay for hover effect -->
            <div
              class="group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-all duration-200 hover:bg-black hover:opacity-50"
            >
              <UIcon
                name="ph:eye"
                class="h-4 w-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Custom slot for judul column -->
      <template #judul-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:file-text" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900">
            {{ row.judul }}
          </span>
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
        <div class="flex items-center gap-2">
          <div
            class="bg-primary-100 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <UIcon name="ph:user" class="text-primary-600 h-3 w-3" />
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ row.creator.nama }}
          </span>
        </div>
      </template>

      <!-- Custom slot for actions column -->
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="ph:info"
            size="sm"
            color="white"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddEditBanner('detail', row)"
          />
          <UButton
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddEditBanner('edit', row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteBanner(row)"
          />
        </div>
      </template>
    </DataTableComponent>

    <!-- Add/Edit/Detail Banner Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="
        modalMode === 'detail'
          ? 'Detail Banner'
          : itemToEdit
            ? 'Edit Banner'
            : 'Tambah Banner Baru'
      "
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSaveBanner">
        <!-- Nama Banner Field -->
        <div>
          <label
            for="judul"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Judul Banner <span class="text-red-500">*</span>
          </label>
          <UInput
            id="judul"
            v-model="formData.judul"
            type="text"
            placeholder="Masukkan judul banner..."
            size="lg"
            :color="formErrors.judul ? 'red' : 'primary'"
            class="w-full"
            :disabled="modalMode === 'detail'"
          />
          <p v-if="formErrors.judul" class="mt-1 text-sm text-red-600">
            {{ formErrors.judul }}
          </p>
        </div>

        <!-- Deskripsi Banner Field -->
        <div>
          <label
            for="deskripsi"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Deskripsi Banner <span class="text-red-500">*</span>
          </label>
          <UTextarea
            id="deskripsi"
            v-model="formData.deskripsi"
            type="text"
            placeholder="Masukkan deskripsi banner..."
            size="lg"
            :color="formErrors.deskripsi ? 'red' : 'primary'"
            class="w-full"
            :disabled="modalMode === 'detail'"
          />
          <p v-if="formErrors.deskripsi" class="mt-1 text-sm text-red-600">
            {{ formErrors.deskripsi }}
          </p>
        </div>

        <!-- Link Banner Field -->
        <div>
          <label
            for="link"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Link Banner (Opsional)
          </label>
          <UInput
            id="link"
            v-model="formData.link"
            type="text"
            placeholder="Masukkan link banner..."
            size="lg"
            :color="formErrors.link ? 'red' : 'primary'"
            class="w-full"
            :disabled="modalMode === 'detail'"
          />
          <p v-if="formErrors.link" class="mt-1 text-sm text-red-600">
            {{ formErrors.link }}
          </p>
        </div>

        <div>
          <label
            for="link"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Status Banner
          </label>
          <USwitch
            id="isActive"
            v-model="formData.isActive"
            :label="formData.isActive ? 'Aktif' : 'Tidak Aktif'"
            :disabled="modalMode === 'detail'"
          />
        </div>

        <!-- File Upload or Preview -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Gambar Banner <span class="text-red-500">*</span>
          </label>
          <template v-if="modalMode === 'detail'">
            <div class="flex items-start gap-4">
              <div
                class="h-40 w-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  :src="itemToEdit?.image || 'https://placehold.co/256x160'"
                  :alt="formData.judul || 'Banner'"
                  class="h-full w-full object-contain"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Edit mode image preview (selected file takes precedence, falls back to existing image) -->
            <div
              v-if="
                (modalMode === 'edit' &&
                  formData.files &&
                  formData.files.length > 0) ||
                !isUploadFileEditExist
              "
              class="mb-3 flex items-start gap-4"
            >
              <div
                class="h-40 w-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  :src="
                    formData.files && formData.files.length > 0
                      ? URL.createObjectURL(formData.files[0])
                      : itemToEdit?.image || 'https://placehold.co/256x160'
                  "
                  :alt="formData.judul || 'Banner'"
                  class="h-full w-full object-contain"
                />
              </div>
            </div>
            <UFileUpload
              v-model="formData.files"
              accept="image/*"
              :max-files="1"
              :max-size="2000000"
              label="Pilih gambar banner"
              description="Format yang didukung: JPG, PNG, GIF (maksimal 2MB)"
              :color="formErrors.files ? 'red' : 'primary'"
              class="w-full"
              @update:model-value="isUploadFileEditExist = true"
            >
              <template #actions="{ open, files, remove }">
                <div class="flex flex-col gap-3">
                  <!-- Show selected file -->
                  <div v-if="files && files.length > 0" class="space-y-2">
                    <div
                      v-for="(file, index) in files"
                      :key="index"
                      class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div class="flex items-center gap-3">
                        <!-- Image preview -->
                        <div
                          class="h-12 w-12 overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            :src="URL.createObjectURL(file)"
                            :alt="file.name"
                            class="h-full w-full object-cover"
                          />
                        </div>
                        <div class="flex flex-col">
                          <span
                            class="max-w-48 truncate text-sm font-medium text-gray-900"
                          >
                            {{ file.name }}
                          </span>
                          <span class="text-xs text-gray-500">
                            {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <UButton
                          icon="i-heroicons-photo"
                          color="gray"
                          variant="ghost"
                          size="sm"
                          @click="open()"
                        >
                          Ganti
                        </UButton>
                        <UButton
                          icon="i-heroicons-x-mark"
                          color="red"
                          variant="ghost"
                          size="sm"
                          @click="remove(index)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </UFileUpload>
            <p v-if="formErrors.files" class="mt-1 text-sm text-red-600">
              {{ formErrors.files }}
            </p>
          </template>
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
            @click="handleCancelAdd"
          >
            {{ modalMode === "detail" ? "Tutup" : "Batal" }}
          </UButton>
          <UButton
            v-if="modalMode !== 'detail'"
            type="button"
            color="primary"
            size="lg"
            @click="handleSaveBanner"
          >
            Simpan Banner
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

    <!-- Image View Modal -->
    <ModalComponent
      v-model:is-open="isImageModalOpen"
      title="Preview Gambar Banner"
      size="xl"
      @close="handleCloseImageModal"
    >
      <div class="space-y-4">
        <div v-if="selectedImage" class="text-center">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">
            {{ selectedImage.judul }}
          </h3>
          <div class="flex justify-center">
            <div
              class="max-w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              <img
                :src="selectedImage.image"
                :alt="selectedImage.judul"
                class="max-h-96 w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div
            v-if="selectedImage.deskripsi"
            class="mt-4 text-sm text-gray-600"
          >
            <p class="font-medium">Deskripsi:</p>
            <p>{{ selectedImage.deskripsi }}</p>
          </div>
          <div v-if="selectedImage.link" class="mt-2 text-sm text-gray-600">
            <p class="font-medium">Link:</p>
            <a
              :href="selectedImage.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ selectedImage.link }}
            </a>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            type="button"
            color="gray"
            variant="soft"
            size="lg"
            @click="handleCloseImageModal"
          >
            Tutup
          </UButton>
          <UButton
            type="button"
            color="primary"
            size="lg"
            @click="handleAddEditBanner('detail', selectedImage)"
          >
            Lihat Detail Lengkap
          </UButton>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>
