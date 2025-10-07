<script setup>
definePageMeta({
  title: "Daftar Sifat Surat",
  description: "Kelola data sifat surat",
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
  sifat: "",
});

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus sifat surat "${itemToDelete.value.sifat}"?`
    : "Apakah Anda yakin ingin menghapus sifat surat ini?";
});

// Correct implementation - fetch from backend
const { data: allSifatSuratData, refresh: refreshSifat } = await useAsyncData(
  "sifat-surat",
  () => bphapiService.getSifatSurat(),
  {
    default: () => [],
    transform: (data) => data?.data || [],
    server: false,
    lazy: true,
  },
);

// Table columns configuration
const columns = [
  {
    key: "sifat",
    label: "Nama Sifat Surat",
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

  if (!formData.value.sifat.trim()) {
    errors.sifat = "Nama sifat surat wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    sifat: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddSifatSurat = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEditSifatSurat = (item) => {
  isEditMode.value = true;
  itemToEdit.value = item;
  formData.value = {
    sifat: item.sifat,
  };
  formErrors.value = {};
  isModalOpen.value = true;
};

const handleSaveSifatSurat = async () => {
  if (!validateForm()) {
    return;
  }

  if (isEditMode.value) {
    if (itemToEdit.value) {
      const updatedData = {
        sifat: formData.value.sifat.trim(),
      };

      await bphapiService.updateSifatSurat(itemToEdit.value.id, updatedData);

      await refreshSifat();

      toast.add({
        title: "Berhasil",
        description: "Sifat surat berhasil diubah",
        color: "success",
      });
    }
  } else {
    await bphapiService.createSifatSurat({
      sifat: formData.value.sifat.trim(),
    });

    await refreshSifat();

    toast.add({
      title: "Berhasil",
      description: "Sifat surat berhasil ditambahkan",
      color: "success",
    });
  }

  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;

  triggerRef(allSifatSuratData);
};

const handleCancelModal = () => {
  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;
};

const handleDeleteSifatSurat = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    const index = allSifatSuratData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      await bphapiService.deleteSifatSurat(itemToDelete.value.id);
      await refreshSifat();
      console.log("Sifat surat deleted:", itemToDelete.value);
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
          <h1 class="text-gray-title text-2xl font-bold">Daftar Sifat Surat</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddSifatSurat"
        >
          Tambah Sifat Surat
        </UButton>
      </div>
    </div>
    <!-- Data Table -->
    <DataTableComponent
      :data="allSifatSuratData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for sifat column -->
      <template #sifat-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:file-text" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900"> {{ row.sifat }} </span>
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
          ></div>
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
            @click="handleEditSifatSurat(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteSifatSurat(row)"
          />
        </div>
      </template>
    </DataTableComponent>
    <!-- Sifat Surat Modal (Create/Edit) -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="isEditMode ? 'Edit Sifat Surat' : 'Tambah Sifat Surat Baru'"
      size="lg"
      @close="handleCancelModal"
    >
      <form class="space-y-6" @submit.prevent="handleSaveSifatSurat">
        <!-- Nama Sifat Surat Field -->
        <div>
          <label
            for="sifat"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Sifat Surat <span class="text-red-500">*</span>
          </label>
          <UInput
            id="sifat"
            v-model="formData.sifat"
            type="text"
            placeholder="Masukkan nama sifat surat..."
            size="lg"
            :color="formErrors.sifat ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.sifat" class="mt-1 text-sm text-red-600">
            {{ formErrors.sifat }}
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
            @click="handleSaveSifatSurat"
          >
            {{ isEditMode ? "Simpan Perubahan" : "Simpan Sifat Surat" }}
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
