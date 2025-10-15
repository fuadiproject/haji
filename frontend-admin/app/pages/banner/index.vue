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
const selectedImage = ref({
  row: null,
  image: null,
});
const modalMode = ref("add");

// Form data
const formData = ref({
  judul: "",
  deskripsi: "",
  link: "",
  isActive: true,
  lightImage: {
    files: null,
    preview: null,
  },
  darkImage: {
    files: null,
    preview: null,
  },
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
    key: "dark_image",
    label: "Gambar Tema Gelap",
    width: "25%",
  },
  {
    key: "light_image",
    label: "Gambar Tema Terang",
    width: "25%",
  },
  {
    key: "title",
    label: "Judul",
    width: "30%",
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

  if (!formData.value.deskripsi.trim()) {
    errors.deskripsi = "Deskripsi banner wajib diisi";
  }

  // Validate images for add mode
  if (modalMode.value === "add") {
    if (
      !formData.value.lightImage.files ||
      formData.value.lightImage.files.length === 0
    ) {
      errors.lightImage = "Gambar tema terang wajib diunggah";
    }
    if (
      !formData.value.darkImage.files ||
      formData.value.darkImage.files.length === 0
    ) {
      errors.darkImage = "Gambar tema gelap wajib diunggah";
    }
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
    lightImage: {
      files: [],
      preview: null,
    },
    darkImage: {
      files: [],
      preview: null,
    },
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
      lightImage: {
        files: null,
        preview: item?.light_image || null,
      },
      darkImage: {
        files: null,
        preview: item?.dark_image || null,
      },
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
      lightImage: {
        files: [],
        preview: item?.light_image || null,
      },
      darkImage: {
        files: [],
        preview: item?.dark_image || null,
      },
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
    // Edit mode: upload new images only if provided
    let lightImageId = null;
    let darkImageId = null;

    console.log("formData", formData.value);

    // Upload light image if a new one is selected
    if (formData.value.lightImage.files != null) {
      const form = new FormData();
      form.append("file", formData.value.lightImage.files);

      const fileResponse = await createFile(form);
      if (!fileResponse.success) {
        toast.add({
          title: `Gagal Mengupload Gambar Tema Terang. ${fileResponse.message}`,
          description: fileResponse.message,
          color: "error",
        });
        return;
      }
      lightImageId = fileResponse.data.id;
    }

    // Upload dark image if a new one is selected
    if (formData.value.darkImage.files != null) {
      const form = new FormData();
      form.append("file", formData.value.darkImage.files);

      const fileResponse = await createFile(form);
      if (!fileResponse.success) {
        toast.add({
          title: `Gagal Mengupload Gambar Tema Gelap. ${fileResponse.message}`,
          description: fileResponse.message,
          color: "error",
        });
        return;
      }
      darkImageId = fileResponse.data.id;
    }

    const payload = {
      title: formData.value.judul,
      light_image: lightImageId,
      dark_image: darkImageId,
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
    // Add mode: both images are required
    // Upload light image
    const lightForm = new FormData();
    lightForm.append("file", formData.value.lightImage.files);

    const lightFileResponse = await createFile(lightForm);
    if (!lightFileResponse.success) {
      toast.add({
        title: `Gagal Mengupload Gambar Tema Terang. ${lightFileResponse.message}`,
        description: lightFileResponse.message,
        color: "error",
      });
      return;
    }

    // Upload dark image
    const darkForm = new FormData();
    darkForm.append("file", formData.value.darkImage.files);

    const darkFileResponse = await createFile(darkForm);
    if (!darkFileResponse.success) {
      toast.add({
        title: `Gagal Mengupload Gambar Tema Gelap. ${darkFileResponse.message}`,
        description: darkFileResponse.message,
        color: "error",
      });
      return;
    }

    const payload = {
      title: formData.value.judul,
      light_image: lightFileResponse.data.id,
      dark_image: darkFileResponse.data.id,
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

// Handle image modal functionality
const handleViewImage = (item, image) => {
  selectedImage.value.image = image;
  selectedImage.value.row = item;
  isImageModalOpen.value = true;
};

const handleCloseImageModal = () => {
  isImageModalOpen.value = false;
  selectedImage.value = {
    row: null,
    image: null,
  };
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
      <template #dark_image-data="{ row }">
        <div class="flex items-center justify-center">
          <div
            class="group relative cursor-pointer"
            @click="handleViewImage(row, row.dark_image)"
          >
            <NuxtImg
              :src="row.dark_image"
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

      <!-- Custom slot for image column -->
      <template #light_image-data="{ row }">
        <div class="flex items-center justify-center">
          <div
            class="group relative cursor-pointer"
            @click="handleViewImage(row, row.light_image)"
          >
            <NuxtImg
              :src="row.light_image"
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

        <div
          class="flex flex-row items-center justify-between rounded-lg border-1 border-gray-200 p-2"
        >
          <div>
            <label for="link" class="block text-sm font-medium text-gray-700">
              Status Banner
            </label>
            <label class="font-sm block text-sm text-gray-600">
              Aktifkan banner untuk ditampilkan
            </label>
          </div>

          <div>
            <USwitch
              id="isActive"
              v-model="formData.isActive"
              :label="formData.isActive ? 'Aktif' : 'Tidak Aktif'"
              :disabled="modalMode === 'detail'"
            />
          </div>
        </div>

        <!-- Dual Image Upload Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">
            Gambar Banner <span class="text-red-500">*</span>
          </label>
          <p class="text-sm text-gray-600">
            Upload gambar untuk tema terang dan tema gelap
          </p>

          <!-- Light Mode Image -->
          <div
            class="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="ph:sun-duotone" class="h-5 w-5 text-yellow-500" />
              <h4 class="text-sm font-semibold text-gray-900">
                Gambar Tema Terang <span class="text-red-500">*</span>
              </h4>
            </div>

            <template v-if="modalMode === 'detail'">
              <div class="flex items-start gap-4">
                <div
                  class="h-40 w-full overflow-hidden rounded-lg border border-gray-300 bg-white"
                >
                  <img
                    :src="
                      formData.lightImage.preview ||
                      'https://placehold.co/640x160/f3f4f6/9ca3af?text=Tema+Terang'
                    "
                    :alt="`${formData.judul || 'Banner'} - Tema Terang`"
                    class="h-full w-full object-contain"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <!-- Preview existing or new light image -->
              <div
                v-if="
                  modalMode === 'edit' &&
                  formData.lightImage.preview &&
                  formData.lightImage.files == null
                "
                class="mb-3"
              >
                <div
                  class="h-40 w-full overflow-hidden rounded-lg border border-gray-300 bg-white"
                >
                  <img
                    :src="
                      formData.lightImage.files != null
                        ? URL.createObjectURL(formData.lightImage.files[0])
                        : formData.lightImage.preview ||
                          'https://placehold.co/640x160/f3f4f6/9ca3af?text=Tema+Terang'
                    "
                    :alt="`${formData.judul || 'Banner'} - Tema Terang`"
                    class="h-full w-full object-contain"
                  />
                </div>
              </div>
              <UFileUpload
                v-model="formData.lightImage.files"
                accept="image/*"
                :max-files="1"
                :max-size="2000000"
                label="Pilih gambar tema terang"
                description="Format: JPG, PNG, GIF (maks. 2MB)"
                :color="formErrors.lightImage ? 'red' : 'primary'"
                class="w-full"
              />
              <p v-if="formErrors.lightImage" class="mt-1 text-sm text-red-600">
                {{ formErrors.lightImage }}
              </p>
            </template>
          </div>

          <!-- Dark Mode Image -->
          <div
            class="rounded-lg border-2 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="ph:moon-duotone" class="h-5 w-5 text-blue-400" />
              <h4 class="text-sm font-semibold text-white">
                Gambar Tema Gelap <span class="text-red-400">*</span>
              </h4>
            </div>

            <template v-if="modalMode === 'detail'">
              <div class="flex items-start gap-4">
                <div
                  class="h-40 w-full overflow-hidden rounded-lg border border-gray-600 bg-gray-800"
                >
                  <img
                    :src="
                      formData.darkImage.preview ||
                      'https://placehold.co/640x160/1f2937/9ca3af?text=Tema+Gelap'
                    "
                    :alt="`${formData.judul || 'Banner'} - Tema Gelap`"
                    class="h-full w-full object-contain"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <!-- Preview existing or new dark image -->
              <div
                v-if="
                  modalMode === 'edit' &&
                  formData.darkImage.preview &&
                  formData.darkImage.files == null
                "
                class="mb-3"
              >
                <div
                  class="h-40 w-full overflow-hidden rounded-lg border border-gray-600 bg-gray-800"
                >
                  <img
                    :src="
                      formData.darkImage.files != null
                        ? URL.createObjectURL(formData.darkImage.files[0])
                        : formData.darkImage.preview ||
                          'https://placehold.co/640x160/1f2937/9ca3af?text=Tema+Gelap'
                    "
                    :alt="`${formData.judul || 'Banner'} - Tema Gelap`"
                    class="h-full w-full object-contain"
                  />
                </div>
              </div>
              <UFileUpload
                v-model="formData.darkImage.files"
                accept="image/*"
                :max-files="1"
                :max-size="2000000"
                label="Pilih gambar tema gelap"
                description="Format: JPG, PNG, GIF (maks. 2MB)"
                :color="formErrors.darkImage ? 'red' : 'primary'"
                class="w-full"
              />
              <p v-if="formErrors.darkImage" class="mt-1 text-sm text-red-600">
                {{ formErrors.darkImage }}
              </p>
            </template>
          </div>
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
            {{ selectedImage.row.judul }}
          </h3>
          <div class="flex justify-center">
            <div
              class="max-w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              <img
                :src="selectedImage.image"
                :alt="selectedImage.row.judul"
                class="max-h-96 w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div
            v-if="selectedImage.row.deskripsi"
            class="mt-4 text-sm text-gray-600"
          >
            <p class="font-medium">Deskripsi:</p>
            <p>{{ selectedImage.row.deskripsi }}</p>
          </div>
          <div v-if="selectedImage.link" class="mt-2 text-sm text-gray-600">
            <p class="font-medium">Link:</p>
            <a
              :href="selectedImage.row.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ selectedImage.row.link }}
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
