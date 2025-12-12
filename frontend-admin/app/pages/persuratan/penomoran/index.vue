<script setup>
definePageMeta({
  title: "Daftar Penomoran",
  description: "Kelola data penomoran",
});

const toast = useToast();

const persuratanApi = useServicePersuratanApi();

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const isEditMode = ref(false);

// Form data
const formData = ref({
  kode: "",
  nama: "",
  format: "",
});

// Form validation errors
const formErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus penomoran "${itemToDelete.value.nama}"?`
    : "Apakah Anda yakin ingin menghapus penomoran ini?";
});

// Correct implementation - fetch from backend
const { data: allTemplatePenomoranData, refresh: refreshTemplatePenomoran } =
  await useAsyncData(
    "template-penomoran",
    () => persuratanApi.getAllTemplatePenomoran(),
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
    key: "kode",
    label: "Kode",
    width: "10%",
  },
  {
    key: "nama",
    label: "Nama",
    width: "10%",
  },
  {
    key: "format",
    label: "Format",
    width: "10%",
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

  if (!formData.value.kode.trim()) {
    errors.kode = "Kode wajib diisi";
  }

  if (!formData.value.nama.trim()) {
    errors.nama = "Nama wajib diisi";
  }

  if (!formData.value.format.trim()) {
    errors.format = "Format wajib diisi";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    kode: "",
    nama: "",
    format: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddPenomoran = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEditPenomoran = (item) => {
  isEditMode.value = true;
  itemToEdit.value = item;
  formData.value = {
    kode: item.kode || "",
    nama: item.nama || "",
    format: item.format || "",
  };
  formErrors.value = {};
  isModalOpen.value = true;
};

const handleSavePenomoran = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    if (isEditMode.value) {
      if (itemToEdit.value) {
        const updatedData = {
          kode: formData.value.kode.trim(),
          nama: formData.value.nama.trim(),
          format: formData.value.format.trim(),
        };

        await persuratanApi.updateTemplatePenomoran(
          itemToEdit.value.id,
          updatedData,
        );

        await refreshTemplatePenomoran();

        toast.add({
          title: "Berhasil",
          description: "Penomoran berhasil diubah",
          color: "success",
        });
      }
    } else {
      await persuratanApi.createTemplatePenomoran({
        kode: formData.value.kode.trim(),
        nama: formData.value.nama.trim(),
        format: formData.value.format.trim(),
      });

      await refreshTemplatePenomoran();

      toast.add({
        title: "Berhasil",
        description: "Penomoran berhasil ditambahkan",
        color: "success",
      });
    }

    isModalOpen.value = false;
    resetForm();
    itemToEdit.value = null;
    isEditMode.value = false;

    triggerRef(allTemplatePenomoranData);
  } catch (error) {
    toast.add({
      title: "Error",
      description:
        error?.data?.message || "Terjadi kesalahan saat menyimpan data",
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

const handleDeletePenomoran = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    try {
      await persuratanApi.deleteTemplatePenomoran(itemToDelete.value.id);
      await refreshTemplatePenomoran();

      toast.add({
        title: "Berhasil",
        description: "Penomoran berhasil dihapus",
        color: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error?.data?.message || "Terjadi kesalahan saat menghapus data",
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
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">
            List Format Penomoran
          </h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddPenomoran"
        >
          Tambah Penomoran
        </UButton>
      </div>
    </div>
    <!-- Data Table -->
    <DataTableComponent
      :data="allTemplatePenomoranData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for createdAt column -->
      <template #createdAt-data="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.createdAt || row.created_at) }}
        </span>
      </template>
      <!-- Custom slot for updatedAt column -->
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.updatedAt || row.updated_at) }}
        </span>
      </template>
      <!-- Custom slot for createdBy column -->
      <template #createdBy-data="{ row }">
        <div v-if="row.created_by" class="flex items-center gap-2">
          <div
            class="bg-primary-100 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <UIcon name="ph:user" class="text-primary-600 h-3 w-3" />
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ row.created_by }}
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
            @click="handleEditPenomoran(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeletePenomoran(row)"
          />
        </div>
      </template>
    </DataTableComponent>
    <!-- Penomoran Modal (Create/Edit) -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="isEditMode ? 'Edit Penomoran' : 'Tambah Penomoran Baru'"
      size="lg"
      @close="handleCancelModal"
    >
      <form class="space-y-6" @submit.prevent="handleSavePenomoran">
        <!-- Kode Field -->
        <div>
          <label
            for="kode"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Kode <span class="text-red-500">*</span>
          </label>
          <UInput
            id="kode"
            v-model="formData.kode"
            type="text"
            placeholder="Masukkan kode penomoran (contoh: SK)..."
            size="lg"
            :color="formErrors.kode ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.kode" class="mt-1 text-sm text-red-600">
            {{ formErrors.kode }}
          </p>
        </div>
        <!-- Nama Field -->
        <div>
          <label
            for="nama"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama <span class="text-red-500">*</span>
          </label>
          <UInput
            id="nama"
            v-model="formData.nama"
            type="text"
            placeholder="Masukkan nama penomoran (contoh: Surat Keputusan)..."
            size="lg"
            :color="formErrors.nama ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.nama" class="mt-1 text-sm text-red-600">
            {{ formErrors.nama }}
          </p>
        </div>
        <!-- Format Field -->
        <div>
          <label
            for="format"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Format <span class="text-red-500">*</span>
          </label>
          <UInput
            id="format"
            v-model="formData.format"
            type="text"
            placeholder="Masukkan format penomoran (contoh: {NO}/SK/{SATKER}/{YEAR})..."
            size="lg"
            :color="formErrors.format ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.format" class="mt-1 text-sm text-red-600">
            {{ formErrors.format }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Gunakan placeholder seperti {NO}, {SATKER}, {YEAR}, dll.
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
            @click="handleSavePenomoran"
          >
            {{ isEditMode ? "Simpan Perubahan" : "Simpan Penomoran" }}
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
