<script setup>
const toast = useToast();

definePageMeta({
  title: "Manajemen User",
  description: "Kelola data user dan admin",
});

const { hasRole, checkTokenExpiration } = useAuth();
const { getAllUsers, getAllKantor, createUser, updateUser, deleteUser } = usePresensiApi();

if (!hasRole("admin")) {
  navigateTo("/");
}

// Loading states
const isLoadingUsers = ref(true);
const isLoadingKantor = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const modalMode = ref("add");

// Data
const users = ref([]);

// Form data
const formData = ref({
  username: "",
  password: "",
  role: "admin_satker",
  nama_satker: "",
  kode_satker: "",
});

// Form validation errors
const formErrors = ref({});

// Options
const roleOptions = [
  { label: "Admin Pusat", value: "admin" },
  { label: "Admin Satker", value: "admin_satker" },
];

const satkerOptions = ref([]);

// Table columns configuration
const columns = [
  {
    key: "no",
    label: "No",
    width: "5%",
  },
  {
    key: "username",
    label: "Username",
    width: "25%",
  },
  {
    key: "nama_satker",
    label: "Nama Satker",
    width: "30%",
  },
  {
    key: "role",
    label: "Role",
    width: "20%",
  },
  {
    key: "actions",
    label: "Aksi",
    width: "20%",
  },
];

// Pagination configuration
const paginationConfig = ref({
  enabled: true,
  currentPage: 1,
  itemsPerPage: 10,
  showItemsPerPage: true,
  showPaginationInfo: true,
  itemsPerPageOptions: [
    { label: "5 per halaman", value: 5 },
    { label: "10 per halaman", value: 10 },
    { label: "20 per halaman", value: 20 },
    { label: "50 per halaman", value: 50 },
  ],
});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value
    ? `Apakah Anda yakin ingin menghapus user "${itemToDelete.value.username}"?`
    : "Apakah Anda yakin ingin menghapus user ini?";
});

const tableData = computed(() => {
  return users.value.map((user, index) => ({
    ...user,
    no: index + 1,
  }));
});

// Fetch users from API
const fetchUsers = async () => {
  if (checkTokenExpiration()) return;

  isLoadingUsers.value = true;
  try {
    const response = await getAllUsers();
    if (response?.data) {
      users.value = response.data;
    } else if (Array.isArray(response)) {
      users.value = response;
    }
  } catch (error) {
    const _ = error
    toast.add({
      title: "Error",
      description: "Gagal memuat data user",
      color: "error",
    });
  } finally {
    isLoadingUsers.value = false;
  }
};

// Fetch kantor/satker options from API
const fetchKantor = async () => {
  isLoadingKantor.value = true;
  try {
    const response = await getAllKantor();
    if (response?.data) {
      satkerOptions.value = response.data.map((kantor) => ({
        label: kantor.nama,
        value: kantor.kode_satker,
        kode_satker: kantor.kode_satker,
      }));
    } else if (Array.isArray(response)) {
      satkerOptions.value = response.map((kantor) => ({
        label: kantor.nama,
        value: kantor.kode_satker,
        kode_satker: kantor.kode_satker,
      }));
    }
  } catch (error) {
    const _ = error
    toast.add({
      title: "Error",
      description: "Gagal memuat data satker",
      color: "error",
    });
  } finally {
    isLoadingKantor.value = false;
  }
};

// Form validation
const validateForm = () => {
  const errors = {};

  if (!formData.value.username.trim()) {
    errors.username = "Username wajib diisi";
  }

  if (modalMode.value === "add" && !formData.value.password.trim()) {
    errors.password = "Password wajib diisi";
  }

  if (!formData.value.kode_satker) {
    errors.nama_satker = "Satker wajib dipilih";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    username: "",
    password: "",
    role: "admin_satker",
    nama_satker: "",
    kode_satker: "",
  };
  formErrors.value = {};
};

// Action handlers
const handleAddEditUser = (type, item) => {
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
    formData.value = {
      username: item?.username || "",
      password: "",
      role: item?.role || "admin_satker",
      nama_satker: item?.nama_satker || "",
      kode_satker: item?.kode_satker || "",
    };
    formErrors.value = {};
    isModalOpen.value = true;
    return;
  }

  if (type === "detail") {
    modalMode.value = "detail";
    itemToEdit.value = item;
    formData.value = {
      username: item?.username || "",
      password: "",
      role: item?.role || "admin_satker",
      nama_satker: item?.nama_satker || "",
      kode_satker: item?.kode_satker || "",
    };
    formErrors.value = {};
    isModalOpen.value = true;
  }
};

const handleSaveUser = async () => {
  if (!validateForm()) {
    return;
  }

  if (checkTokenExpiration()) return;

  isSaving.value = true;

  // Get selected satker details
  const selectedSatker = satkerOptions.value.find(
    (s) => s.value === formData.value.kode_satker
  );

  try {
    if (itemToEdit.value) {
      // Edit mode
      const updateData = {
        username: formData.value.username,
        role: formData.value.role,
        nama_satker: selectedSatker?.label || formData.value.nama_satker,
        kode_satker: formData.value.kode_satker,
      };

      // Only include password if provided
      if (formData.value.password.trim()) {
        updateData.password = formData.value.password;
      }

      await updateUser(itemToEdit.value.id, updateData);

      toast.add({
        title: "Berhasil",
        description: "User berhasil diubah",
        color: "success",
      });
    } else {
      // Add mode
      await createUser({
        username: formData.value.username,
        password: formData.value.password,
        role: formData.value.role,
        nama_satker: selectedSatker?.label || "",
        kode_satker: formData.value.kode_satker,
      });

      toast.add({
        title: "Berhasil",
        description: "User berhasil ditambahkan",
        color: "success",
      });
    }

    isModalOpen.value = false;
    resetForm();
    await fetchUsers();
  } catch (error) {
    toast.add({
      title: "Error",
      description: error?.data?.message || "Gagal menyimpan user",
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  itemToEdit.value = null;
  resetForm();
};

const handleDeleteUser = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) {
    handleCancelDelete();
    return;
  }

  if (checkTokenExpiration()) return;

  isDeleting.value = true;

  try {
    await deleteUser(itemToDelete.value.id);
    toast.add({
      title: "Berhasil",
      description: "User berhasil dihapus",
      color: "success",
    });
    await fetchUsers();
  } catch (error) {
    toast.add({
      title: "Error",
      description: error?.data?.message || "Gagal menghapus user",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
    handleCancelDelete();
  }
};

const handleCancelDelete = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

// Table event handlers
const handlePaginationUpdate = (newPagination) => {
  paginationConfig.value = { ...newPagination };
};

// Helper functions
const getRoleLabel = (role) => {
  return role === "admin" ? "Admin Pusat" : "Admin Satker";
};

const getRoleClass = (role) => {
  return role === "admin"
    ? "bg-purple-100 text-purple-800"
    : "bg-green-100 text-green-800";
};

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchKantor()]);
});
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">Manajemen User</h1>
        </div>
        <UButton
          icon="ph:plus"
          size="lg"
          class="bg-primary-main"
          @click="handleAddEditUser('add')"
        >
          Tambah User
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingUsers" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon name="ph:spinner" class="h-8 w-8 animate-spin text-primary-600" />
        <p class="mt-2 text-gray-600">Memuat data user...</p>
      </div>
    </div>

    <!-- Data Table -->
    <DataTableComponent
      v-else
      :data="tableData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
    >
      <!-- Custom slot for no column -->
      <template #no-data="{ row }">
        <span class="text-sm text-gray-900">{{ row.no }}</span>
      </template>

      <!-- Custom slot for username column -->
      <template #username-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:user" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900">
            {{ row.username }}
          </span>
        </div>
      </template>

      <!-- Custom slot for nama_satker column -->
      <template #nama_satker-data="{ row }">
        <span class="text-sm text-gray-600">{{ row.nama_satker }}</span>
      </template>

      <!-- Custom slot for role column -->
      <template #role-data="{ row }">
        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
          :class="getRoleClass(row.role)"
        >
          {{ getRoleLabel(row.role) }}
        </span>
      </template>

      <!-- Custom slot for actions column -->
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="ph:info"
            size="sm"
            color="white"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddEditUser('detail', row)"
          />
          <UButton
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddEditUser('edit', row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteUser(row)"
          />
        </div>
      </template>
    </DataTableComponent>

    <!-- Add/Edit/Detail User Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      :title="
        modalMode === 'detail'
          ? 'Detail User'
          : itemToEdit
            ? 'Edit User'
            : 'Tambah User Baru'
      "
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSaveUser">
        <!-- Username Field -->
        <div>
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Username <span class="text-red-500">*</span>
          </label>
          <UInput
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Masukkan username..."
            size="lg"
            :color="formErrors.username ? 'red' : 'primary'"
            class="w-full"
            :disabled="modalMode === 'detail'"
          />
          <p v-if="formErrors.username" class="mt-1 text-sm text-red-600">
            {{ formErrors.username }}
          </p>
        </div>

        <!-- Password Field (only for add mode or optionally for edit) -->
        <div v-if="modalMode === 'add' || modalMode === 'edit'">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
            <span v-if="modalMode === 'add'" class="text-red-500">*</span>
            <span v-else class="text-gray-400 text-xs">(kosongkan jika tidak ingin mengubah)</span>
          </label>
          <UInput
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Masukkan password..."
            size="lg"
            :color="formErrors.password ? 'red' : 'primary'"
            class="w-full"
          />
          <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">
            {{ formErrors.password }}
          </p>
        </div>

        <!-- Role Field -->
        <div>
          <label
            for="role"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Role <span class="text-red-500">*</span>
          </label>
          <USelect
            id="role"
            v-model="formData.role"
            :items="roleOptions"
            size="lg"
            class="w-full"
            :disabled="modalMode === 'detail'"
            :ui="{ content: 'z-[100]' }"
          />
        </div>

        <!-- Satker Field -->
        <div>
          <label
            for="kode_satker"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Satker <span class="text-red-500">*</span>
          </label>
          <USelect
            id="kode_satker"
            v-model="formData.kode_satker"
            :items="satkerOptions"
            :loading="isLoadingKantor"
            size="lg"
            :color="formErrors.nama_satker ? 'red' : 'primary'"
            class="w-full"
            :disabled="modalMode === 'detail'"
            :ui="{ content: 'z-[100]' }"
          />
          <p v-if="formErrors.nama_satker" class="mt-1 text-sm text-red-600">
            {{ formErrors.nama_satker }}
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
            {{ modalMode === "detail" ? "Tutup" : "Batal" }}
          </UButton>
          <UButton
            v-if="modalMode !== 'detail'"
            type="button"
            color="primary"
            size="lg"
            :loading="isSaving"
            @click="handleSaveUser"
          >
            Simpan User
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
          loading: isDeleting,
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
