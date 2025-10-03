<script setup>
const {
  createFile,
  createHyperlink,
  getHyperlink,
  deleteHyperlink,
  updateHyperlink,
} = useServiceBphapi();
const toast = useToast();
const { formatDate } = useDateUtil();

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

const { data: allHyperlinkData, refresh: refreshHyperlink } =
  await useAsyncData(
    "hyperlinks", // unique key for caching
    () => getHyperlink(), // function that returns a promise
    {
      default: () => [], // default value
      transform: (data) => {
        console.log("Hyperlink API Response:", data);
        return data.data || [];
      }, // transform the data
      server: false, // run on server-side
      lazy: true, // don't block page rendering
    },
  );

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
    (!formData.value.files || formData.value.files.length === 0) &&
    modalMode.value == "add"
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
    // Prefill unified form from selected item (fallbacks for optional fields)
    formData.value = {
      judul: item?.judul || "",
      link: item?.link || "",
      isActive: item?.is_active ?? true,
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
      link: item?.link || "",
      isActive: item?.is_active ?? true,
      files: [],
    };
    formErrors.value = {};
    isModalOpen.value = true;
  }
};

// (removed) separate add handler - use handleAddEditBanner("add") directly

const handleSaveHyperlink = async () => {
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
      logo: keyFile,
      link: formData.value.link,
      is_active: formData.value.isActive,
    };

    const hyperlinkResponse = await updateHyperlink(
      itemToEdit.value.id,
      payload,
    );
    if (!hyperlinkResponse.success) {
      toast.add({
        title: `Gagal Mengupdate Hyperlink. ${hyperlinkResponse.message}`,
        description: hyperlinkResponse.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Berhasil",
      description: "Hyperlink berhasil diubah",
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
      logo: fileResponse.data.key,
      link: formData.value.link,
      is_active: formData.value.isActive,
    };

    const hyperlinkResponse = await createHyperlink(payload);
    if (!hyperlinkResponse.success) {
      toast.add({
        title: `Gagal Menambahkan Hyperlink. ${hyperlinkResponse.message}`,
        description: hyperlinkResponse.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Berhasil",
      description: "Hyperlink berhasil ditambahkan",
      color: "success",
    });
  }

  await refreshHyperlink();

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

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    await deleteHyperlink(itemToDelete.value.id);
    await refreshHyperlink();
    toast.add({
      title: "Berhasil",
      description: "Hyperlink berhasil dihapus",
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
              :alt="row.title"
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
            {{ row.title }}
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
            @click="handleAddEditHyperlink('detail', row)"
          />
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

    <!-- Add/Edit/Detail Hyperlink Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="
        modalMode === 'detail'
          ? 'Detail Hyperlink'
          : itemToEdit
            ? 'Edit Hyperlink'
            : 'Tambah Hyperlink Baru'
      "
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
            :disabled="modalMode === 'detail'"
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
            :disabled="modalMode === 'detail'"
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
            :disabled="modalMode === 'detail'"
          />
        </div>

        <!-- File Upload Logo -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Logo Hyperlink <span class="text-red-500">*</span>
          </label>
          <template v-if="modalMode === 'detail'">
            <div class="flex items-start gap-4">
              <div
                class="h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  :src="itemToEdit?.logo || 'https://placehold.co/80x80'"
                  :alt="formData.judul || 'Logo'"
                  class="h-full w-full object-contain"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Edit mode logo preview (selected file takes precedence, falls back to existing image) -->
            <div
              v-if="modalMode === 'edit'"
              class="mb-3 flex items-start gap-4"
            >
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
