<script setup>
definePageMeta({
  title: "Daftar Template File",
  description: "Kelola data template file",
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
  file: "",
});

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus template file "${itemToDelete.value.file}"?`
    : "Apakah Anda yakin ingin menghapus template file ini?";
});

// Correct implementation - fetch from backend
const { data: allUrgensiSuratData, refresh: refreshUrgensi } =
  await useAsyncData("template-file", () => bphapiService.getTemplateFile(), {
    default: () => [],
    transform: (data) => data?.data || [],
    server: false,
    lazy: true,
  });

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

  if (!formData.value.file.trim()) {
    errors.file = "Nama template file wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    file: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddUrgensiSurat = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEditUrgensiSurat = (item) => {
  isEditMode.value = true;
  itemToEdit.value = item;
  formData.value = {
    urgensi: item.urgensi,
  };
  formErrors.value = {};
  isModalOpen.value = true;
};

const handleSaveUrgensiSurat = async () => {
  if (!validateForm()) {
    return;
  }

  if (isEditMode.value) {
    if (itemToEdit.value) {
      const updatedData = {
        urgensi: formData.value.urgensi.trim(),
      };

      await bphapiService.updateUrgensiSurat(itemToEdit.value.id, updatedData);

      await refreshUrgensi();

      toast.add({
        title: "Berhasil",
        description: "Urgensi surat berhasil diubah",
        color: "success",
      });
    }
  } else {
    await bphapiService.createUrgensiSurat({
      urgensi: formData.value.urgensi.trim(),
    });

    await refreshUrgensi();

    toast.add({
      title: "Berhasil",
      description: "Urgensi surat berhasil ditambahkan",
      color: "success",
    });
  }

  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;

  triggerRef(allUrgensiSuratData);
};

const handleCancelModal = () => {
  isModalOpen.value = false;
  resetForm();
  itemToEdit.value = null;
  isEditMode.value = false;
};

const handleDeleteUrgensiSurat = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    const index = allUrgensiSuratData.value.findIndex(
      (p) => p.id === itemToDelete.value.id,
    );
    if (index > -1) {
      await bphapiService.deleteUrgensiSurat(itemToDelete.value.id);
      await refreshUrgensi();
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
            Daftar Template File
          </h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddUrgensiSurat"
        >
          Tambah Template File
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
      <!-- Custom slot for urgensi column -->
      <template #urgensi-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:clock" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900"> {{ row.urgensi }} </span>
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
    <!-- Urgensi Surat Modal (Create/Edit) -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="isEditMode ? 'Edit Urgensi Surat' : 'Tambah Urgensi Surat Baru'"
      size="lg"
      @close="handleCancelModal"
    >
      <form class="space-y-6" @submit.prevent="handleSaveUrgensiSurat">
        <!-- Nama Urgensi Surat Field -->
        <div>
          <label
            for="urgensi"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Urgensi Surat <span class="text-red-500">*</span>
          </label>
          <UInput
            id="urgensi"
            v-model="formData.urgensi"
            type="text"
            placeholder="Masukkan nama urgensi surat..."
            size="lg"
            :color="formErrors.urgensi ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.urgensi" class="mt-1 text-sm text-red-600">
            {{ formErrors.urgensi }}
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
            @click="handleSaveUrgensiSurat"
          >
            {{ isEditMode ? "Simpan Perubahan" : "Simpan Urgensi Surat" }}
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
