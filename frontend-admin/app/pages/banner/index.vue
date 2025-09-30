<script setup>
definePageMeta({
  title: "Daftar Banner",
  description: "Kelola data banner dan panduan",
});

// Modal state
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const itemToEdit = ref(null);

// Form data
const formData = ref({
  nama: ''
});

// Edit form data
const editFormData = ref({
  nama: ''
});

// Form validation errors
const formErrors = ref({});
const editFormErrors = ref({});

// Computed properties
const deleteModalMessage = computed(() => {
  return itemToDelete.value 
    ? `Apakah Anda yakin ingin menghapus banner "${itemToDelete.value.nama}"?`
    : 'Apakah Anda yakin ingin menghapus banner ini?';
});

// Sample data for the table (expanded for pagination demo)
const allBannerData = ref([
  {
    id: 1,
    image: "https://placehold.co/150x100",
    judul: "Banner Teknis Penggunaan Sistem",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    createdBy: "Admin System"
  },
  {
    id: 2,
    image: "https://placehold.co/150x100",
    judul: "Panduan Operasional Harian",
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    createdBy: "Manager Operasional"
  },
  {
    id: 3,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Keamanan Data",
    createdAt: new Date("2024-01-05T11:00:00"),
    updatedAt: new Date("2024-01-22T13:30:00"),
    createdBy: "IT Security"
  },
  {
    id: 4,
    image: "https://placehold.co/150x100",
    judul: "Banner Backup dan Recovery",
    createdAt: new Date("2024-01-12T08:45:00"),
    updatedAt: new Date("2024-01-25T10:15:00"),
    createdBy: "Database Admin"
  },
  {
    id: 5,
    image: "https://placehold.co/150x100",
    judul: "Manual Troubleshooting",
    createdAt: new Date("2024-01-08T14:20:00"),
    updatedAt: new Date("2024-01-19T11:50:00"),
    createdBy: "Technical Support"
  },
  {
    id: 6,
    image: "https://placehold.co/150x100",
    judul: "Panduan Instalasi Software",
    createdAt: new Date("2024-01-03T16:45:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
    createdBy: "IT Support"
  },
  {
    id: 7,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Maintenance Server",
    createdAt: new Date("2024-01-07T13:20:00"),
    updatedAt: new Date("2024-01-21T11:15:00"),
    createdBy: "System Administrator"
  },
  {
    id: 8,
    image: "https://placehold.co/150x100",
    judul: "Manual Konfigurasi Network",
    createdAt: new Date("2024-01-11T08:00:00"),
    updatedAt: new Date("2024-01-23T14:30:00"),
    createdBy: "Network Engineer"
  },
  {
    id: 9,
    image: "https://placehold.co/150x100",
    judul: "Banner Monitoring Sistem",
    createdAt: new Date("2024-01-14T10:15:00"),
    updatedAt: new Date("2024-01-26T16:45:00"),
    createdBy: "Operations Team"
  },
  {
    id: 10,
    image: "https://placehold.co/150x100",
    judul: "Panduan Recovery Database",
    createdAt: new Date("2024-01-09T12:30:00"),
    updatedAt: new Date("2024-01-24T13:20:00"),
    createdBy: "Database Admin"
  },
  {
    id: 11,
    image: "https://placehold.co/150x100",
    judul: "Manual User Management",
    createdAt: new Date("2024-01-06T15:45:00"),
    updatedAt: new Date("2024-01-17T10:30:00"),
    createdBy: "Admin System"
  },
  {
    id: 12,
    image: "https://placehold.co/150x100",
    judul: "Prosedur Audit Sistem",
    createdAt: new Date("2024-01-13T09:20:00"),
    updatedAt: new Date("2024-01-27T15:10:00"),
    createdBy: "Audit Team"
  }
]);

// Table columns configuration
const columns = [
    {
      key: 'image',
      label: 'Gambar',
      width: '20%'
    },    
    {
      key: 'judul',
      label: 'Judul',
      width: '40%'
    },
    {
      key: 'createdAt',
      label: 'Dibuat Pada',
      width: '20%'
    },
    {
      key: 'updatedAt', 
      label: 'Diperbarui Pada',
      width: '20%'
    },
    {
      key: 'createdBy',
      label: 'Dibuat Oleh',
      width: '15%'
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '5%'
    }
];

// Pagination configuration
const paginationConfig = ref({
  enabled: true,
  currentPage: 1,
  itemsPerPage: 5,
  showItemsPerPage: true,
  showPaginationInfo: true,
  itemsPerPageOptions: [
    { label: '5 per halaman', value: 5 },
    { label: '10 per halaman', value: 10 },
    { label: '20 per halaman', value: 20 },
    { label: '50 per halaman', value: 50 }
  ]
});



// Format date to Indonesian format
const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Form validation
const validateForm = () => {
  const errors = {};
  
  if (!formData.value.nama.trim()) {
    errors.nama = 'Nama banner wajib diisi';
  }
  
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Edit form validation
const validateEditForm = () => {
  const errors = {};
  
  if (!editFormData.value.nama.trim()) {
    errors.nama = 'Nama banner wajib diisi';
  }
  
  editFormErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Reset form
const resetForm = () => {
  formData.value = {
    nama: '',    
  };
  formErrors.value = {};
};

// Reset edit form
const resetEditForm = () => {
  editFormData.value = {
    nama: ''
  };
  editFormErrors.value = {};
};

// Action handlers
const handleAddBanner = () => {
  resetForm();
  isModalOpen.value = true;
};

const handleSaveBanner = () => {
  if (!validateForm()) {
    return;
  }
  
  // Generate new ID
  const newId = Math.max(...allBannerData.value.map(item => item.id)) + 1;
  
  // Create new banner object
  const newBanner = {
    id: newId,
    nama: formData.value.nama.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),    
  };
  
  // Add to the beginning of the array
  allBannerData.value.unshift(newBanner);
  
  // Close modal and reset form
  isModalOpen.value = false;
  resetForm();
  
  console.log('New banner added:', newBanner);
};

const handleCancelAdd = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleEditBanner = (item) => {
  itemToEdit.value = item;
  editFormData.value = {
    nama: item.nama
  };
  editFormErrors.value = {};
  isEditModalOpen.value = true;
};

const handleSaveEditBanner = () => {
  if (!validateEditForm()) {
    return;
  }
  
  if (itemToEdit.value) {
    const index = allBannerData.value.findIndex(p => p.id === itemToEdit.value.id);
    if (index > -1) {
      // Update the item
      allBannerData.value[index] = {
        ...allBannerData.value[index],
        nama: editFormData.value.nama.trim(),
        updatedAt: new Date()
      };
      console.log('Banner updated:', allBannerData.value[index]);
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

const handleDeleteBanner = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (itemToDelete.value) {
    const index = allBannerData.value.findIndex(p => p.id === itemToDelete.value.id);
    if (index > -1) {
      allBannerData.value.splice(index, 1);
      console.log('Banner deleted:', itemToDelete.value);
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
  console.log('Row clicked:', row, index);
  // TODO: Implement row click functionality if needed
};

// Handle add/view image functionality
const handleAddImage = (item) => {
  console.log('View/Add image for:', item);
  // TODO: Implement image upload/view functionality
};
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">Daftar Banner</h1>          
        </div>
        <UButton
          icon="ph:plus"
          size="lg"          
          class="bg-primary-main"
          @click="handleAddBanner"          
        >
          Tambah Banner
        </UButton>
      </div>
    </div>

    <!-- Data Table -->
    <DataTableComponent
      :data="allBannerData"
      :columns="columns"
      :pagination="paginationConfig"
      @update:pagination="handlePaginationUpdate"
      @row-click="handleRowClick"
    >
      <!-- Custom slot for image column -->
      <template #image-data="{ row }">
        <div class="flex items-center justify-center">
          <div class="relative group cursor-pointer" @click="handleAddImage(row)">
            <NuxtImg
              :src="row.image"
              :alt="row.judul"
              class="w-16 h-12 object-cover rounded-lg border border-gray-200 shadow-sm transition-all duration-200 group-hover:shadow-md"
              loading="lazy"
              placeholder
              :placeholder-class="'w-16 h-12 bg-gray-100 rounded-lg border border-gray-200'"
            />
            <!-- Overlay for hover effect -->
            <div class="absolute inset-0 hover:bg-black opacity-0 hover:opacity-50 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
              <UIcon 
                name="ph:eye" 
                class="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Custom slot for judul column -->
      <template #judul-data="{ row }">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <UIcon name="ph:file-text" class="h-4 w-4 text-primary-600" />
          </div>
          <span class="font-medium text-gray-900">
            {{ row.judul }}
          </span>
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
          <div class="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
            <UIcon name="ph:user" class="h-3 w-3 text-primary-600" />
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
            icon="ph:info"
            size="sm"            
            :ui="{ rounded: 'rounded-full' }"
            @click="handleAddImage(row)"
          />
          <UButton
            icon="ph:pencil-simple"
            size="sm"
            color="blue"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleEditBanner(row)"
          />
          <UButton
            icon="ph:trash"
            size="sm"
            color="red"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
            @click="handleDeleteBanner(row)"
          />
        </div>
      </template>
      
    </DataTableComponent>

    <!-- Add Banner Modal -->
    <ModalComponent
      v-model:is-open="isModalOpen"
      title="Tambah Banner Baru"
      size="lg"
      @close="handleCancelAdd"
    >
      <form class="space-y-6" @submit.prevent="handleSavePetunjuk">
        <!-- Nama Banner Field -->
        <div>
          <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">
            Nama Banner <span class="text-red-500">*</span>
          </label>
          <UInput
            id="nama"
            v-model="formData.nama"
            type="text"
            placeholder="Masukkan nama banner..."
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
            @click="handleSaveBanner"
          >
            Simpan Banner
          </UButton>
        </div>
      </template>
    </ModalComponent>

    <!-- Edit Banner Modal -->
    <ModalComponent
      v-model:is-open="isEditModalOpen"
      title="Edit Banner"
      size="lg"
      @close="handleCancelEdit"
    >
      <form class="space-y-6" @submit.prevent="handleSaveEditPetunjuk">
        <!-- Nama Banner Field -->
        <div>
          <label for="edit-nama" class="block text-sm font-medium text-gray-700 mb-2">
            Nama Banner <span class="text-red-500">*</span>
          </label>
          <UInput
            id="edit-nama"
            v-model="editFormData.nama"
            type="text"
            placeholder="Masukkan nama banner..."
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
            @click="handleSaveEditBanner"
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
          text: 'Hapus'
        },
        {
          variant: 'secondary',
          text: 'Batal'
        }
      ]"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
      @close="handleCancelDelete"
    >
      <div class="text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <UIcon name="ph:trash" class="h-6 w-6 text-red-600" />
        </div>
        <p class="text-gray-600">
          Data yang dihapus tidak dapat dikembalikan. Pastikan Anda yakin dengan keputusan ini.
        </p>
      </div>
    </ModalConfirmComponent>
  </div>
</template>
