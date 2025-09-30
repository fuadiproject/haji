<script setup>
definePageMeta({
  title: "Daftar Urgensi Surat",
  description: "Kelola data urgensi surat",
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
    ? `Apakah Anda yakin ingin menghapus urgensi surat "${itemToDelete.value.nama}"?`
    : "Apakah Anda yakin ingin menghapus urgensi surat ini?";
});

// Sample data for the table
const allUrgensiSuratData = ref([
  {
    id: 1,
    nama: "Sangat Urgent",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    createdBy: "Admin System",
  },
  {
    id: 2,
    nama: "Urgent",
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    createdBy: "Manager Operasional",
  },
  {
    id: 3,
    nama: "Normal",
    createdAt: new Date("2024-01-05T11:00:00"),
    updatedAt: new Date("2024-01-22T13:30:00"),
    createdBy: "IT Security",
  },
  {
    id: 4,
    nama: "Rendah",
    createdAt: new Date("2024-01-12T08:45:00"),
    updatedAt: new Date("2024-01-25T10:15:00"),
    createdBy: "Database Admin",
  },
  {
    id: 5,
    nama: "Segera",
    createdAt: new Date("2024-01-08T14:20:00"),
    updatedAt: new Date("2024-01-19T11:50:00"),
    createdBy: "Technical Support",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "nama",
    label: "Nama Urgensi Surat",
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
    errors.nama = "Nama urgensi surat wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Edit form validation
const validateEditForm = () => {
  const errors = {};

  if (!editFormData.value.nama.trim()) {
    errors.nama = "Nama urgensi surat wajib diisi";
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
const handleAddUrgensiSurat = () => {
  resetForm();
  isModalOpen.value = true;
};

const handleSaveUrgensiSurat = () => {
  if (!validateForm()) {
    return;
  }

  // Generate new ID
  const newId =
    Math.max(...allUrgensiSuratData.value.map((item) => item.id)) + 1;

  // Create new urgensi surat object
  const newUrgensiSurat = {
    id: newId,
    nama: formData.value.nama.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to the beginning of the array
  allUrgensiSuratData.value.unshift(newUrgensiSurat);

  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();

  console.log("New urgensi surat added:", newUrgensiSurat);
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleEditUrgensiSurat = (item) => {
  itemToEdit.value = item;
  editFormData.value = {
    nama: item.nama,
  };
  editFormErrors.value = {};
  isEditModalOpen.value = true;
};

const handleSaveEditUrgensiSurat = () => {
  if (!validateEditForm()) {
    return;
  }

  if (itemToEdit.value) {
    const index = allUrgensiSuratData.value.findIndex(
      (p) => p.id === itemToEdit.value.id,
    );
    if (index > -1) {
      // Update the item
      allUrgensiSuratData.value[index] = {
        ...allUrgensiSuratData.value[index],
        nama: editFormData.value.nama.trim(),
        updatedAt: new Date(),
      };
      console.log("Urgensi surat updated:", allUrgensiSuratData.value[index]);
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

const handleDeleteUrgensiSurat = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (itemToDelete.value) {
    const index = allUrgensiSuratData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      allUrgensiSuratData.value.splice(index, 1);
      console.log("Urgensi surat deleted:", itemToDelete.value);
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
          <h1 class="text-gray-title text-2xl font-bold">
            Daftar Urgensi Surat
          </h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddUrgensiSurat"
        >
          Tambah Urgensi Surat
        </UButton>
      </div>
    </div>
    <!-- Data Table -->
    <DataTableComponent
      :data="allUrgensiSuratData"
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
            <UIcon name="ph:clock" class="text-primary-600 h-4 w-4" />
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
            @click="handleEditUrgensiSurat(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteUrgensiSurat(row)"
          />
        </div>
      </template>
    </DataTableComponent>
    <!-- Add Urgensi Surat Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      title="Tambah Urgensi Surat Baru"
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSaveUrgensiSurat">
        <!-- Nama Urgensi Surat Field -->
        <div>
          <label
            for="nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Urgensi Surat <span class="text-red-500">*</span>
          </label>
          <UInput
            id="nama"
            v-model="formData.nama"
            type="text"
            placeholder="Masukkan nama urgensi surat..."
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
            @click="handleSaveUrgensiSurat"
          >
            Simpan Urgensi Surat
          </UButton>
        </div>
      </template>
    </ModalComponent>
    <!-- Edit Urgensi Surat Modal -->
    <ModalComponent
      v-model:is-open="isEditModalOpen"
      title="Edit Urgensi Surat"
      size="lg"
      @close="handleCancelEdit"
    >
      <form class="space-y-6" @submit.prevent="handleSaveEditUrgensiSurat">
        <!-- Nama Urgensi Surat Field -->
        <div>
          <label
            for="edit-nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Urgensi Surat <span class="text-red-500">*</span>
          </label>
          <UInput
            id="edit-nama"
            v-model="editFormData.nama"
            type="text"
            placeholder="Masukkan nama urgensi surat..."
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
            @click="handleSaveEditUrgensiSurat"
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
