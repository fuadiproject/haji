<script setup>
const toast = useToast();

definePageMeta({
  title: "Manajemen User",
  description: "Kelola data user dan admin",
});

const { hasRole } = useAuth();

if (!hasRole("admin_pusat")) {
  navigateTo("/");
}

// Modal state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);
const modalMode = ref("add");

// Data
const users = ref([
  {
    id: 1,
    username: "admin_pusat",
    nama_satker: "Pusat",
    role: "admin_pusat",
  },
  {
    id: 2,
    username: "admin_satker",
    nama_satker: "Sekretariat Jenderal",
    role: "admin_satker",
  },
]);

// Form data
const formData = ref({
  username: "",
  password: "",
  role: "admin_satker",
  nama_satker: "",
});

// Form validation errors
const formErrors = ref({});

// Options
const roleOptions = [
  { label: "Admin Pusat", value: "admin_pusat" },
  { label: "Admin Satker", value: "admin_satker" },
];

const satkerOptions = [
  { label: "Pusat", value: "Pusat" },
  { label: "Sekretariat Jenderal", value: "Sekretariat Jenderal" },
  { label: "Inspektorat Jenderal", value: "Inspektorat Jenderal" },
  {
    label: "Direktorat Jenderal Penyelenggaraan Haji",
    value: "Direktorat Jenderal Penyelenggaraan Haji",
  },
];

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

// Form validation
const validateForm = () => {
  const errors = {};

  if (!formData.value.username.trim()) {
    errors.username = "Username wajib diisi";
  }

  if (modalMode.value === "add" && !formData.value.password.trim()) {
    errors.password = "Password wajib diisi";
  }

  if (!formData.value.nama_satker) {
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
    };
    formErrors.value = {};
    isModalOpen.value = true;
  }
};

const handleSaveUser = async () => {
  if (!validateForm()) {
    return;
  }

  if (itemToEdit.value) {
    // Edit mode
    const idx = users.value.findIndex((u) => u.id === itemToEdit.value.id);
    if (idx !== -1) {
      users.value[idx] = {
        ...users.value[idx],
        username: formData.value.username,
        role: formData.value.role,
        nama_satker: formData.value.nama_satker,
      };
    }

    toast.add({
      title: "Berhasil",
      description: "User berhasil diubah",
      color: "success",
    });
  } else {
    // Add mode
    users.value.push({
      id: Date.now(),
      username: formData.value.username,
      role: formData.value.role,
      nama_satker: formData.value.nama_satker,
    });

    toast.add({
      title: "Berhasil",
      description: "User berhasil ditambahkan",
      color: "success",
    });
  }

  isModalOpen.value = false;
  resetForm();
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
  if (itemToDelete.value) {
    users.value = users.value.filter((u) => u.id !== itemToDelete.value.id);
    toast.add({
      title: "Berhasil",
      description: "User berhasil dihapus",
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

// Helper functions
const getRoleLabel = (role) => {
  return role === "admin_pusat" ? "Admin Pusat" : "Admin Satker";
};

const getRoleClass = (role) => {
  return role === "admin_pusat"
    ? "bg-purple-100 text-purple-800"
    : "bg-green-100 text-green-800";
};
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

    <!-- Data Table -->
    <DataTableComponent
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

        <!-- Password Field (only for add mode) -->
        <div v-if="modalMode === 'add'">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Password <span class="text-red-500">*</span>
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
            for="nama_satker"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Satker <span class="text-red-500">*</span>
          </label>
          <USelect
            id="nama_satker"
            v-model="formData.nama_satker"
            :items="satkerOptions"
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
