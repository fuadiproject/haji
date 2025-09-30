<script setup>
definePageMeta({
  title: "Daftar Petunjuk",
  description: "Kelola data petunjuk dan panduan",
});

// Modal state
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);

// Form data
const formData = ref({
  nama: "",
});

// Edit form data
const editFormData = ref({
  nama: "",
});

// Form validation errors
const formErrors = ref({});
const editFormErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus petunjuk "${itemToDelete.value.nama}"?`
    : "Apakah Anda yakin ingin menghapus petunjuk ini?";
});

// Sample data for the table (expanded for pagination demo)
const allPetunjukData = ref([
  {
    id: 1,
    nama: "Petunjuk Teknis Penggunaan Sistem",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    createdBy: "Admin System",
  },
  {
    id: 2,
    nama: "Panduan Operasional Harian",
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    createdBy: "Manager Operasional",
  },
  {
    id: 3,
    nama: "Prosedur Keamanan Data",
    createdAt: new Date("2024-01-05T11:00:00"),
    updatedAt: new Date("2024-01-22T13:30:00"),
    createdBy: "IT Security",
  },
  {
    id: 4,
    nama: "Petunjuk Backup dan Recovery",
    createdAt: new Date("2024-01-12T08:45:00"),
    updatedAt: new Date("2024-01-25T10:15:00"),
    createdBy: "Database Admin",
  },
  {
    id: 5,
    nama: "Manual Troubleshooting",
    createdAt: new Date("2024-01-08T14:20:00"),
    updatedAt: new Date("2024-01-19T11:50:00"),
    createdBy: "Technical Support",
  },
  {
    id: 6,
    nama: "Panduan Instalasi Software",
    createdAt: new Date("2024-01-03T16:45:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
    createdBy: "IT Support",
  },
  {
    id: 7,
    nama: "Prosedur Maintenance Server",
    createdAt: new Date("2024-01-07T13:20:00"),
    updatedAt: new Date("2024-01-21T11:15:00"),
    createdBy: "System Administrator",
  },
  {
    id: 8,
    nama: "Manual Konfigurasi Network",
    createdAt: new Date("2024-01-11T08:00:00"),
    updatedAt: new Date("2024-01-23T14:30:00"),
    createdBy: "Network Engineer",
  },
  {
    id: 9,
    nama: "Petunjuk Monitoring Sistem",
    createdAt: new Date("2024-01-14T10:15:00"),
    updatedAt: new Date("2024-01-26T16:45:00"),
    createdBy: "Operations Team",
  },
  {
    id: 10,
    nama: "Panduan Recovery Database",
    createdAt: new Date("2024-01-09T12:30:00"),
    updatedAt: new Date("2024-01-24T13:20:00"),
    createdBy: "Database Admin",
  },
  {
    id: 11,
    nama: "Manual User Management",
    createdAt: new Date("2024-01-06T15:45:00"),
    updatedAt: new Date("2024-01-17T10:30:00"),
    createdBy: "Admin System",
  },
  {
    id: 12,
    nama: "Prosedur Audit Sistem",
    createdAt: new Date("2024-01-13T09:20:00"),
    updatedAt: new Date("2024-01-27T15:10:00"),
    createdBy: "Audit Team",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "nama",
    label: "Nama Petunjuk",
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

  if (!formData.value.nama.trim()) {
    errors.nama = "Nama petunjuk wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Edit form validation
const validateEditForm = () => {
  const errors = {};

  if (!editFormData.value.nama.trim()) {
    errors.nama = "Nama petunjuk wajib diisi";
  }

  editFormErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    nama: "",
  };
  formErrors.value = {};
};

// Reset edit form
const resetEditForm = () => {
  editFormData.value = {
    nama: "",
  };
  editFormErrors.value = {};
};

// Action handlers
const handleAddPetunjuk = () => {
  resetForm();
  isModalOpen.value = true;
};

const handleSavePetunjuk = () => {
  if (!validateForm()) {
    return;
  }

  // Generate new ID
  const newId = Math.max(...allPetunjukData.value.map((item) => item.id)) + 1;

  // Create new petunjuk object
  const newPetunjuk = {
    id: newId,
    nama: formData.value.nama.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to the beginning of the array
  allPetunjukData.value.unshift(newPetunjuk);

  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();

  console.log("New petunjuk added:", newPetunjuk);
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleEditPetunjuk = (item) => {
  itemToEdit.value = item;
  editFormData.value = {
    nama: item.nama,
  };
  editFormErrors.value = {};
  isEditModalOpen.value = true;
};

const handleSaveEditPetunjuk = () => {
  if (!validateEditForm()) {
    return;
  }

  if (itemToEdit.value) {
    const index = allPetunjukData.value.findIndex(
      (p) => p.id === itemToEdit.value.id,
    );
    if (index > -1) {
      // Update the item
      allPetunjukData.value[index] = {
        ...allPetunjukData.value[index],
        nama: editFormData.value.nama.trim(),
        updatedAt: new Date(),
      };
      console.log("Petunjuk updated:", allPetunjukData.value[index]);
    }
  }

  // Close modal and reset form
  isEditModalOpen.value = false;
  resetEditForm();
  itemToEdit.value = null;
};

const handleCancelEdit = () => {
  isEditModalOpen.value = false;
  resetEditForm();
  itemToEdit.value = null;
};

const handleDeletePetunjuk = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (itemToDelete.value) {
    const index = allPetunjukData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      allPetunjukData.value.splice(index, 1);
      console.log("Petunjuk deleted:", itemToDelete.value);
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
          <h1 class="text-gray-title text-2xl font-bold">Daftar Petunjuk</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddPetunjuk"
        >
          Tambah Petunjuk
        </UButton>
      </div>
    </div>
    <!-- Data Table -->
    <DataTableComponent
      :data="allPetunjukData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for nama column -->
      <template #nama-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:file-text" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900"> {{ row.nama }} </span>
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
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleEditPetunjuk(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeletePetunjuk(row)"
          />
        </div>
      </template>
    </DataTableComponent>
    <!-- Add Petunjuk Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      title="Tambah Petunjuk Baru"
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSavePetunjuk">
        <!-- Nama Petunjuk Field -->
        <div>
          <label
            for="nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Petunjuk <span class="text-red-500">*</span>
          </label>
          <UInput
            id="nama"
            v-model="formData.nama"
            type="text"
            placeholder="Masukkan nama petunjuk..."
            size="lg"
            :color="formErrors.nama ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.nama" class="mt-1 text-sm text-red-600">
            {{ formErrors.nama }}
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
            @click="handleSavePetunjuk"
          >
            Simpan Petunjuk
          </UButton>
        </div>
      </template>
    </ModalComponent>
    <!-- Edit Petunjuk Modal -->
    <ModalComponent
      v-model:is-open="isEditModalOpen"
      title="Edit Petunjuk"
      size="lg"
      @close="handleCancelEdit"
    >
      <form class="space-y-6" @submit.prevent="handleSaveEditPetunjuk">
        <!-- Nama Petunjuk Field -->
        <div>
          <label
            for="edit-nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Petunjuk <span class="text-red-500">*</span>
          </label>
          <UInput
            id="edit-nama"
            v-model="editFormData.nama"
            type="text"
            placeholder="Masukkan nama petunjuk..."
            size="lg"
            :color="editFormErrors.nama ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="editFormErrors.nama" class="mt-1 text-sm text-red-600">
            {{ editFormErrors.nama }}
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
            @click="handleCancelEdit"
          >
            Batal
          </UButton>
          <UButton
            type="button"
            color="primary"
            size="lg"
            @click="handleSaveEditPetunjuk"
          >
            Simpan Perubahan
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
