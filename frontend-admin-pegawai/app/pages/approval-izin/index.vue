<script setup>
const toast = useToast();
const { formatDate } = useDateUtil();

definePageMeta({
  title: "Approval Izin",
  description: "Kelola persetujuan izin pegawai",
});

const { hasRole } = useAuth();

if (!hasRole("admin_satker")) {
  navigateTo("/");
}

// Modal state
const isDetailModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedItem = ref(null);
const confirmAction = ref(null);

// Data
const izinData = ref([
  {
    id: 1,
    nip: "199001012020011001",
    nama: "Ahmad Fauzi",
    kategori: "Cuti Tahunan",
    tanggal: "2026-02-05",
    alasan: "Keperluan keluarga",
    status: "pending",
  },
  {
    id: 2,
    nip: "199203152021012002",
    nama: "Siti Rahayu",
    kategori: "Izin Sakit",
    tanggal: "2026-02-03",
    alasan: "Sakit demam",
    status: "pending",
  },
  {
    id: 3,
    nip: "198807202019031003",
    nama: "Budi Santoso",
    kategori: "Cuti Tahunan",
    tanggal: "2026-02-10",
    alasan: "Acara pernikahan keluarga",
    status: "approved",
  },
  {
    id: 4,
    nip: "199505102022011004",
    nama: "Dewi Lestari",
    kategori: "Izin Tidak Masuk",
    tanggal: "2026-02-01",
    alasan: "Urusan pribadi",
    status: "rejected",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "no",
    label: "No",
    width: "5%",
  },
  {
    key: "nip",
    label: "NIP",
    width: "15%",
  },
  {
    key: "nama",
    label: "Nama",
    width: "15%",
  },
  {
    key: "kategori",
    label: "Kategori",
    width: "12%",
  },
  {
    key: "tanggal",
    label: "Tanggal",
    width: "12%",
  },
  {
    key: "alasan",
    label: "Alasan",
    width: "18%",
  },
  {
    key: "status",
    label: "Status",
    width: "10%",
  },
  {
    key: "actions",
    label: "Aksi",
    width: "13%",
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
const tableData = computed(() => {
  return izinData.value.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
});

const confirmModalMessage = computed(() => {
  if (!selectedItem.value || !confirmAction.value) return "";
  const action = confirmAction.value === "approve" ? "menyetujui" : "menolak";
  return `Apakah Anda yakin ingin ${action} izin dari "${selectedItem.value.nama}"?`;
});

const confirmModalTitle = computed(() => {
  return confirmAction.value === "approve"
    ? "Konfirmasi Persetujuan"
    : "Konfirmasi Penolakan";
});

// Helper functions
const getStatusClass = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    default:
      return "Menunggu";
  }
};

const getCategoryClass = (kategori) => {
  switch (kategori) {
    case "Cuti Tahunan":
      return "bg-blue-100 text-blue-800";
    case "Izin Sakit":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Action handlers
const handleViewDetail = (item) => {
  selectedItem.value = item;
  isDetailModalOpen.value = true;
};

const handleCloseDetail = () => {
  isDetailModalOpen.value = false;
  selectedItem.value = null;
};

const handleApproveClick = (item) => {
  selectedItem.value = item;
  confirmAction.value = "approve";
  isConfirmModalOpen.value = true;
};

const handleRejectClick = (item) => {
  selectedItem.value = item;
  confirmAction.value = "reject";
  isConfirmModalOpen.value = true;
};

const handleConfirmAction = async () => {
  if (selectedItem.value && confirmAction.value) {
    const item = izinData.value.find((i) => i.id === selectedItem.value.id);
    if (item) {
      item.status = confirmAction.value === "approve" ? "approved" : "rejected";

      toast.add({
        title: "Berhasil",
        description:
          confirmAction.value === "approve"
            ? "Izin berhasil disetujui"
            : "Izin berhasil ditolak",
        color: "success",
      });
    }
  }
  handleCancelConfirm();
};

const handleCancelConfirm = () => {
  isConfirmModalOpen.value = false;
  selectedItem.value = null;
  confirmAction.value = null;
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
          <h1 class="text-gray-title text-2xl font-bold">Approval Izin</h1>
        </div>
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

      <!-- Custom slot for nip column -->
      <template #nip-data="{ row }">
        <span class="font-mono text-sm text-gray-900">{{ row.nip }}</span>
      </template>

      <!-- Custom slot for nama column -->
      <template #nama-data="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <UIcon name="ph:user" class="text-primary-600 h-4 w-4" />
          </div>
          <span class="font-medium text-gray-900">
            {{ row.nama }}
          </span>
        </div>
      </template>

      <!-- Custom slot for kategori column -->
      <template #kategori-data="{ row }">
        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
          :class="getCategoryClass(row.kategori)"
        >
          {{ row.kategori }}
        </span>
      </template>

      <!-- Custom slot for tanggal column -->
      <template #tanggal-data="{ row }">
        <span class="text-sm text-gray-600">{{ formatDate(row.tanggal) }}</span>
      </template>

      <!-- Custom slot for alasan column -->
      <template #alasan-data="{ row }">
        <span class="line-clamp-2 text-sm text-gray-600">{{ row.alasan }}</span>
      </template>

      <!-- Custom slot for status column -->
      <template #status-data="{ row }">
        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
          :class="getStatusClass(row.status)"
        >
          {{ getStatusLabel(row.status) }}
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
            @click="handleViewDetail(row)"
          />
          <template v-if="row.status === 'pending'">
            <UButton
              icon="ph:check"
              size="sm"
              color="green"
              variant="soft"
              :ui="{ rounded: 'rounded-full' }"
              @click="handleApproveClick(row)"
            />
            <UButton
              icon="ph:x"
              size="sm"
              color="red"
              variant="soft"
              :ui="{ rounded: 'rounded-full' }"
              @click="handleRejectClick(row)"
            />
          </template>
          <span v-else class="text-sm text-gray-400">-</span>
        </div>
      </template>
    </DataTableComponent>

    <!-- Detail Modal -->
    <ModalComponent
      v-model:is-open="isDetailModalOpen"
      title="Detail Izin"
      size="lg"
      @close="handleCloseDetail"
    >
      <div v-if="selectedItem" class="space-y-6">
        <!-- Employee Info -->
        <div class="flex items-center gap-4">
          <div
            class="bg-primary-100 flex h-16 w-16 items-center justify-center rounded-full"
          >
            <UIcon name="ph:user" class="text-primary-600 h-8 w-8" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedItem.nama }}
            </h3>
            <p class="font-mono text-sm text-gray-600">
              {{ selectedItem.nip }}
            </p>
          </div>
        </div>

        <!-- Detail Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Kategori
            </label>
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
              :class="getCategoryClass(selectedItem.kategori)"
            >
              {{ selectedItem.kategori }}
            </span>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Tanggal
            </label>
            <p class="text-gray-900">{{ formatDate(selectedItem.tanggal) }}</p>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Status
            </label>
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
              :class="getStatusClass(selectedItem.status)"
            >
              {{ getStatusLabel(selectedItem.status) }}
            </span>
          </div>
        </div>

        <!-- Alasan -->
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-500">
            Alasan
          </label>
          <p class="rounded-lg bg-gray-50 p-3 text-gray-900">
            {{ selectedItem.alasan }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            type="button"
            color="gray"
            variant="soft"
            size="lg"
            @click="handleCloseDetail"
          >
            Tutup
          </UButton>
          <template v-if="selectedItem?.status === 'pending'">
            <UButton
              type="button"
              color="red"
              variant="soft"
              size="lg"
              @click="
                handleCloseDetail();
                handleRejectClick(selectedItem);
              "
            >
              Tolak
            </UButton>
            <UButton
              type="button"
              color="green"
              size="lg"
              @click="
                handleCloseDetail();
                handleApproveClick(selectedItem);
              "
            >
              Setujui
            </UButton>
          </template>
        </div>
      </template>
    </ModalComponent>

    <!-- Confirm Action Modal -->
    <ModalConfirmComponent
      v-model:is-open="isConfirmModalOpen"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :buttons="[
        {
          variant: 'primary',
          text: confirmAction === 'approve' ? 'Setujui' : 'Tolak',
        },
        {
          variant: 'secondary',
          text: 'Batal',
        },
      ]"
      @confirm="handleConfirmAction"
      @cancel="handleCancelConfirm"
      @close="handleCancelConfirm"
    >
      <div class="text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          :class="
            confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
          "
        >
          <UIcon
            :name="confirmAction === 'approve' ? 'ph:check' : 'ph:x'"
            class="h-6 w-6"
            :class="
              confirmAction === 'approve' ? 'text-green-600' : 'text-red-600'
            "
          />
        </div>
        <p class="text-gray-600">
          {{
            confirmAction === "approve"
              ? "Izin akan disetujui dan pegawai akan mendapatkan notifikasi."
              : "Izin akan ditolak dan pegawai akan mendapatkan notifikasi."
          }}
        </p>
      </div>
    </ModalConfirmComponent>
  </div>
</template>
