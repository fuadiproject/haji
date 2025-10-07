<script setup>
import { TEXT } from "~/constants/text";

definePageMeta({
  title: "Daftar Petunjuk",
  description: "Kelola data petunjuk dan panduan",
});

const toast = useToast();

const bphapiService = useServiceBphapi();

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const isEditMode = ref(false);

// Form data
const formData = ref({
  petunjuk: "",
});

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus petunjuk "${itemToDelete.value.petunjuk}"?`
    : "Apakah Anda yakin ingin menghapus petunjuk ini?";
});

// Correct implementation
const { data: allPetunjukData, refresh: refreshPetunjuk } = await useAsyncData(
  "petunjuk", // unique key for caching
  () => bphapiService.getPetunjuk(), // function that returns a promise
  {
    default: () => [], // default value
    transform: (data) => data.data || [], // transform the data
    server: false, // run on server-side
    lazy: true, // don't block page rendering
  },
);

// Table columns configuration
const columns = [
  {
    key: "petunjuk",
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

  if (!formData.value.petunjuk.trim()) {
    errors.nama = "Nama petunjuk wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    petunjuk: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddPetunjuk = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEditPetunjuk = (item) => {
  isEditMode.value = true;
  itemToEdit.value = item;
  formData.value = {
    petunjuk: item.petunjuk,
  };
  formErrors.value = {};
  isModalOpen.value = true;
};

const handleSavePetunjuk = async () => {
  if (!validateForm()) {
    return;
  }

  if (isEditMode.value) {
    // Edit mode
    if (itemToEdit.value) {
      const updatedData = {
        petunjuk: formData.value.petunjuk.trim(),
      };

      await bphapiService.updatePetunjuk(itemToEdit.value.id, updatedData);

      // Refetch data from server
      await refreshPetunjuk();

      toast.add({
        title: "Berhasil",
        description: TEXT.petunjukBerhasilDiubah,
        color: "success",
      });
    }
  } else {
    // Create mode
    await bphapiService.createPetunjuk(formData.value.petunjuk.trim());

    // Add to the beginning of the array
    await refreshPetunjuk();

    toast.add({
      title: "Berhasil",
      description: TEXT.petunjukBerhasilDitambahkan,
      color: "success",
    });
  }

  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;

  triggerRef(allPetunjukData);
};

const handleCancelModal = () => {
  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;
};

const handleDeletePetunjuk = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    const index = allPetunjukData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );

    if (index > -1) {
      await bphapiService.deletePetunjuk(itemToDelete.value.id);
      await refreshPetunjuk();
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
    >
      <!-- Custom slot for nama column -->
      <template #petunjuk-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:file-text" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900"> {{ row.petunjuk }} </span>
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
    <!-- Petunjuk Modal (Create/Edit) -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="isEditMode ? 'Edit Petunjuk' : 'Tambah Petunjuk Baru'"
      size="lg"
      @close="handleCancelModal"
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
            v-model="formData.petunjuk"
            type="text"
            placeholder="Masukkan nama petunjuk..."
            size="lg"
            :color="formErrors.petunjuk ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.petunjuk" class="mt-1 text-sm text-red-600">
            {{ formErrors.petunjuk }}
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
            @click="handleSavePetunjuk"
          >
            {{ isEditMode ? "Simpan Perubahan" : "Simpan Petunjuk" }}
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
