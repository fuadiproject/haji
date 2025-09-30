<script setup>
definePageMeta({
  title: "Daftar Banner",
  description: "Kelola data banner dan panduan",
});

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
// Tracks current modal mode: 'add' | 'edit' | 'detail'
const modalMode = ref("add");

// Form data
const formData = ref({
  judul: "",
  deskripsi: "",
  link: "",
  isActive: true,
  files: [],
});

// Unified form handles both add and edit

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus banner "${itemToDelete.value.judul}"?`
    : "Apakah Anda yakin ingin menghapus banner ini?";
});

// Sample data for the table (expanded for pagination demo)
const allBannerData = ref([
  {
    id: 1,
    image: "https://placehold.co/150x100",
    judul: "Banner Teknis Penggunaan Sistem",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    createdBy: "Admin System",
  },
  {
    id: 2,
    image: "https://placehold.co/150x100",
    judul: "Panduan Operasional Harian",
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    createdBy: "Manager Operasional",
  },
  {
    id: 3,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Keamanan Data",
    createdAt: new Date("2024-01-05T11:00:00"),
    updatedAt: new Date("2024-01-22T13:30:00"),
    createdBy: "IT Security",
  },
  {
    id: 4,
    image: "https://placehold.co/150x100",
    judul: "Banner Backup dan Recovery",
    createdAt: new Date("2024-01-12T08:45:00"),
    updatedAt: new Date("2024-01-25T10:15:00"),
    createdBy: "Database Admin",
  },
  {
    id: 5,
    image: "https://placehold.co/150x100",
    judul: "Manual Troubleshooting",
    createdAt: new Date("2024-01-08T14:20:00"),
    updatedAt: new Date("2024-01-19T11:50:00"),
    createdBy: "Technical Support",
  },
  {
    id: 6,
    image: "https://placehold.co/150x100",
    judul: "Panduan Instalasi Software",
    createdAt: new Date("2024-01-03T16:45:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
    createdBy: "IT Support",
  },
  {
    id: 7,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Maintenance Server",
    createdAt: new Date("2024-01-07T13:20:00"),
    updatedAt: new Date("2024-01-21T11:15:00"),
    createdBy: "System Administrator",
  },
  {
    id: 8,
    image: "https://placehold.co/150x100",
    judul: "Manual Konfigurasi Network",
    createdAt: new Date("2024-01-11T08:00:00"),
    updatedAt: new Date("2024-01-23T14:30:00"),
    createdBy: "Network Engineer",
  },
  {
    id: 9,
    image: "https://placehold.co/150x100",
    judul: "Banner Monitoring Sistem",
    createdAt: new Date("2024-01-14T10:15:00"),
    updatedAt: new Date("2024-01-26T16:45:00"),
    createdBy: "Operations Team",
  },
  {
    id: 10,
    image: "https://placehold.co/150x100",
    judul: "Panduan Recovery Database",
    createdAt: new Date("2024-01-09T12:30:00"),
    updatedAt: new Date("2024-01-24T13:20:00"),
    createdBy: "Database Admin",
  },
  {
    id: 11,
    image: "https://placehold.co/150x100",
    judul: "Manual User Management",
    createdAt: new Date("2024-01-06T15:45:00"),
    updatedAt: new Date("2024-01-17T10:30:00"),
    createdBy: "Admin System",
  },
  {
    id: 12,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Audit Sistem",
    createdAt: new Date("2024-01-13T09:20:00"),
    updatedAt: new Date("2024-01-27T15:10:00"),
    createdBy: "Audit Team",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "image",
    label: "Gambar",
    width: "20%",
  },
  {
    key: "judul",
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

// Format date to Indonesian format
const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Form validation
const validateForm = () => {
  const errors = {};

  if (!formData.value.judul.trim()) {
    errors.judul = "Nama banner wajib diisi";
  }

  if (!formData.value.files || formData.value.files.length === 0) {
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

// (removed) separate edit form reset - unified via resetForm

// Action handlers
const handleAddEditBanner = (type, item) => {
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
      judul: item?.judul || "",
      deskripsi: item?.deskripsi || "",
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
      judul: item?.judul || "",
      deskripsi: item?.deskripsi || "",
      link: item?.link || "",
      isActive: item?.isActive ?? true,
      files: [],
    };
    formErrors.value = {};
    isModalOpen.value = true;
  }
};

// (removed) separate add handler - use handleAddEditBanner("add") directly

const handleSaveBanner = () => {
  if (!validateForm()) {
    return;
  }

  // Create image URL from uploaded file (in real app, you'd upload to server)
  let imageUrl = "https://placehold.co/150x100";
  if (formData.value.files && formData.value.files.length > 0) {
    imageUrl = URL.createObjectURL(formData.value.files[0]);
  }

  if (itemToEdit.value) {
    // Update existing banner
    const index = allBannerData.value.findIndex(
      (p) => p.id === itemToEdit.value.id,
    );
    if (index > -1) {
      const existing = allBannerData.value[index];
      allBannerData.value[index] = {
        ...existing,
        judul: formData.value.judul.trim(),
        // Replace image only if new file selected; otherwise keep existing
        image:
          formData.value.files && formData.value.files.length > 0
            ? imageUrl
            : existing.image,
        updatedAt: new Date(),
      };
    }

    console.log("Banner updated:", allBannerData.value[index]);
  } else {
    // Generate new ID safely
    const nextId =
      allBannerData.value.length > 0
        ? Math.max(...allBannerData.value.map((item) => item.id)) + 1
        : 1;

    // Create new banner object
    const newBanner = {
      id: nextId,
      judul: formData.value.judul.trim(),
      image: imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Admin System",
    };

    // Add to the beginning of the array
    allBannerData.value.unshift(newBanner);

    console.log("New banner added:", newBanner);
  }

  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  itemToEdit.value = null;
  resetForm();
};

// (removed) separate edit handler - use handleAddEditBanner("edit", item)

const handleDeleteBanner = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (itemToDelete.value) {
    const index = allBannerData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      allBannerData.value.splice(index, 1);
      console.log("Banner deleted:", itemToDelete.value);
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

// Handle add/view image functionality
const handleAddImage = (item) => {
  // Open detail modal to preview image and read-only info
  handleAddEditBanner("detail", item);
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
            @click="handleAddImage(row)"
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
          {{ formatDate(row.createdAt) }}
        </span>
      </template>

      <!-- Custom slot for updatedAt column -->
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.updatedAt) }}
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
            {{ row.createdBy }}
          </span>
        </div>
      </template>

      <!-- Custom slot for actions column -->
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="ph:info"
            size="sm"
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
              v-if="modalMode === 'edit'"
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
            >
              <template #actions="{ open, files, remove }">
                <div class="flex flex-col gap-3">
                  <UButton
                    v-if="!files || files.length === 0"
                    icon="i-heroicons-photo"
                    color="primary"
                    variant="outline"
                    size="lg"
                    class="w-full justify-center"
                    @click="open()"
                  >
                    Pilih Gambar Banner
                  </UButton>

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
  </div>
</template>
