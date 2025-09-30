<script setup>
definePageMeta({
  title: "Daftar Hyperlink",
  description: "Kelola data hyperlink aplikasi",
});

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const modalMode = ref("add");

// Form data
const formData = ref({
  judul: "",
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
    ? `Apakah Anda yakin ingin menghapus hyperlink "${itemToDelete.value.judul}"?`
    : "Apakah Anda yakin ingin menghapus hyperlink ini?";
});

// Sample data for the table
const allHyperlinkData = ref([
  {
    id: 1,
    logo: "https://placehold.co/80x80",
    judul: "Portal SIMPEG",
    link: "https://simpeg.example.com",
    isActive: true,
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    createdBy: "Admin System",
  },
  {
    id: 2,
    logo: "https://placehold.co/80x80",
    judul: "Sistem E-Office",
    link: "https://eoffice.example.com",
    isActive: true,
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    createdBy: "Manager Operasional",
  },
  {
    id: 3,
    logo: "https://placehold.co/80x80",
    judul: "Aplikasi Presensi Online",
    link: "https://presensi.example.com",
    isActive: false,
    createdAt: new Date("2024-01-05T11:00:00"),
    updatedAt: new Date("2024-01-22T13:30:00"),
    createdBy: "IT Security",
  },
  {
    id: 4,
    logo: "https://placehold.co/80x80",
    judul: "Dashboard Analytics",
    link: "https://analytics.example.com",
    isActive: true,
    createdAt: new Date("2024-01-12T08:45:00"),
    updatedAt: new Date("2024-01-25T10:15:00"),
    createdBy: "Database Admin",
  },
  {
    id: 5,
    logo: "https://placehold.co/80x80",
    judul: "Portal Helpdesk",
    link: "https://helpdesk.example.com",
    isActive: true,
    createdAt: new Date("2024-01-08T14:20:00"),
    updatedAt: new Date("2024-01-19T11:50:00"),
    createdBy: "Technical Support",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "logo",
    label: "Logo",
    width: "10%",
  },
  {
    key: "judul",
    label: "Judul",
    width: "20%",
  },
  {
    key: "link",
    label: "Link",
    width: "20%",
  },
  {
    key: "createdAt",
    label: "Dibuat Pada",
    width: "15%",
  },
  {
    key: "updatedAt",
    label: "Diperbarui Pada",
    width: "15%",
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
    errors.judul = "Judul hyperlink wajib diisi";
  }

  if (!formData.value.link.trim()) {
    errors.link = "Link hyperlink wajib diisi";
  }

  if (
    !itemToEdit.value &&
    (!formData.value.files || formData.value.files.length === 0)
  ) {
    errors.files = "Logo hyperlink wajib diunggah";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    judul: "",
    link: "",
    isActive: true,
    files: [],
  };
  formErrors.value = {};
};

// (removed) separate edit form reset - unified via resetForm

// Action handlers
const handleAddEditHyperlink = (type, item) => {
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
    // Prefill unified form from selected item
    formData.value = {
      judul: item?.judul || "",
      link: item?.link || "",
      isActive: item?.isActive ?? true,
      files: [],
    };
    formErrors.value = {};
    isModalOpen.value = true;
    return;
  }
};

// (removed) separate add handler - use handleAddEditBanner("add") directly

const handleSaveHyperlink = () => {
  if (!validateForm()) {
    return;
  }

  // Create logo URL from uploaded file (in real app, you'd upload to server)
  let logoUrl = "https://placehold.co/80x80";
  if (formData.value.files && formData.value.files.length > 0) {
    logoUrl = URL.createObjectURL(formData.value.files[0]);
  }

  if (itemToEdit.value) {
    // Update existing hyperlink
    const index = allHyperlinkData.value.findIndex(
      (p) => p.id === itemToEdit.value.id,
    );
    if (index > -1) {
      const existing = allHyperlinkData.value[index];
      allHyperlinkData.value[index] = {
        ...existing,
        judul: formData.value.judul.trim(),
        link: formData.value.link.trim(),
        isActive: formData.value.isActive,
        // Replace logo only if new file selected; otherwise keep existing
        logo:
          formData.value.files && formData.value.files.length > 0
            ? logoUrl
            : existing.logo,
        updatedAt: new Date(),
      };
    }

    console.log("Hyperlink updated:", allHyperlinkData.value[index]);
  } else {
    // Generate new ID safely
    const nextId =
      allHyperlinkData.value.length > 0
        ? Math.max(...allHyperlinkData.value.map((item) => item.id)) + 1
        : 1;

    // Create new hyperlink object
    const newHyperlink = {
      id: nextId,
      judul: formData.value.judul.trim(),
      link: formData.value.link.trim(),
      logo: logoUrl,
      isActive: formData.value.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Admin System",
    };

    // Add to the beginning of the array
    allHyperlinkData.value.unshift(newHyperlink);

    console.log("New hyperlink added:", newHyperlink);
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

const handleDeleteHyperlink = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (itemToDelete.value) {
    const index = allHyperlinkData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      allHyperlinkData.value.splice(index, 1);
      console.log("Hyperlink deleted:", itemToDelete.value);
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
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">Daftar Hyperlink</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddEditHyperlink('add')"
        >
          Tambah Hyperlink
        </UButton>
      </div>
    </div>

    <!-- Data Table -->
    <DataTableComponent
      :data="allHyperlinkData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for logo column -->
      <template #logo-data="{ row }">
        <div class="flex items-center justify-center">
          <div class="relative">
            <NuxtImg
              :src="row.logo"
              :alt="row.judul"
              class="h-12 w-12 rounded-lg border border-gray-200 object-cover shadow-sm"
              loading="lazy"
              placeholder
              :placeholder-class="'w-12 h-12 bg-gray-100 rounded-lg border border-gray-200'"
            />
          </div>
        </div>
      </template>

      <!-- Custom slot for judul column -->
      <template #judul-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:link" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900">
            {{ row.judul }}
          </span>
        </div>
      </template>

      <!-- Custom slot for link column -->
      <template #link-data="{ row }">
        <a
          :href="row.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ row.link }}
        </a>
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
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddEditHyperlink('edit', row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteHyperlink(row)"
          />
        </div>
      </template>
    </DataTableComponent>

    <!-- Add/Edit Hyperlink Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="itemToEdit ? 'Edit Hyperlink' : 'Tambah Hyperlink Baru'"
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSaveHyperlink">
        <!-- Judul Hyperlink Field -->
        <div>
          <label
            for="judul"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Judul Hyperlink <span class="text-red-500">*</span>
          </label>
          <UInput
            id="judul"
            v-model="formData.judul"
            type="text"
            placeholder="Masukkan judul hyperlink..."
            size="lg"
            :color="formErrors.judul ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.judul" class="mt-1 text-sm text-red-600">
            {{ formErrors.judul }}
          </p>
        </div>

        <!-- Link Hyperlink Field -->
        <div>
          <label
            for="link"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Link Hyperlink <span class="text-red-500">*</span>
          </label>
          <UInput
            id="link"
            v-model="formData.link"
            type="url"
            placeholder="Masukkan link hyperlink (https://...)..."
            size="lg"
            :color="formErrors.link ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.link" class="mt-1 text-sm text-red-600">
            {{ formErrors.link }}
          </p>
        </div>

        <div>
          <label
            for="isActive"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Status Hyperlink
          </label>
          <USwitch
            id="isActive"
            v-model="formData.isActive"
            :label="formData.isActive ? 'Aktif' : 'Tidak Aktif'"
          />
        </div>

        <!-- File Upload Logo -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Logo Hyperlink <span class="text-red-500">*</span>
          </label>
          <!-- Edit mode logo preview -->
          <div v-if="modalMode === 'edit'" class="mb-3 flex items-start gap-4">
            <div
              class="h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              <img
                :src="
                  formData.files && formData.files.length > 0
                    ? URL.createObjectURL(formData.files[0])
                    : itemToEdit?.logo || 'https://placehold.co/80x80'
                "
                :alt="formData.judul || 'Logo'"
                class="h-full w-full object-contain"
              />
            </div>
          </div>
          <UFileUpload
            v-model="formData.files"
            accept="image/*"
            :max-files="1"
            :max-size="1000000"
            label="Pilih logo hyperlink"
            description="Format yang didukung: JPG, PNG, GIF (maksimal 1MB)"
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
                  Pilih Logo Hyperlink
                </UButton>

                <!-- Show selected file -->
                <div v-if="files && files.length > 0" class="space-y-2">
                  <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div class="flex items-center gap-3">
                      <!-- Logo preview -->
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
            Batal
          </UButton>
          <UButton
            type="button"
            color="primary"
            size="lg"
            @click="handleSaveHyperlink"
          >
            Simpan Hyperlink
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
