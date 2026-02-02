<script setup>
import { ref, computed, onMounted } from "vue";

const toast = useToast();
const { formatDate } = useDateUtil();
const { hasRole, user } = useAuth();
const { getIzinBySatker, setujuiIzin, rejectIzin } = usePresensiApi();

definePageMeta({
  title: "Approval Izin",
  description: "Kelola persetujuan izin pegawai",
});

if (!hasRole("admin_satker")) {
  navigateTo("/");
}

// Modal state
const isDetailModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedItem = ref(null);
const confirmAction = ref(null);
const isLoading = ref(true);

// Data
const izinData = ref([]);

const fetchIzinData = async () => {
  if (!user.value?.kode_satker) return;
  isLoading.value = true;
  try {
    const { data } = await getIzinBySatker(user.value.kode_satker);
    izinData.value = data;
  } catch (error) {
    const _ = error;
    toast.add({
      title: "Error",
      description: "Gagal memuat data izin.",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchIzinData);

// Table columns configuration
const columns = [
  { key: "no", label: "No", width: "5%" },
  { key: "nip", label: "NIP", width: "15%" },
  { key: "nama", label: "Nama", width: "15%" },
  { key: "kategori", label: "Kategori", width: "12%" },
  { key: "tanggal", label: "Tanggal", width: "18%" },
  { key: "alasan", label: "Alasan", width: "18%" },
  { key: "status_persetujuan", label: "Status", width: "150px", sticky: true },
  { key: "actions", label: "Aksi", width: "140px", sticky: true },
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
    no:
      (paginationConfig.value.currentPage - 1) *
        paginationConfig.value.itemsPerPage +
      index +
      1,
    nama: item.pegawai?.nama || "-",
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
    case "disetujui":
      return "bg-green-100 text-green-800";
    case "tidak disetujui":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "disetujui":
      return "Disetujui";
    case "tidak disetujui":
      return "Ditolak";
    default:
      return "Menunggu";
  }
};

const getCategoryClass = (kategori) => {
  // Simple styling for different categories. Expand as needed.
  if (kategori?.toLowerCase().includes("dinas")) {
    return "bg-blue-100 text-blue-800";
  }
  if (kategori?.toLowerCase().includes("sakit")) {
    return "bg-orange-100 text-orange-800";
  }
  if (kategori?.toLowerCase().includes("cuti")) {
    return "bg-purple-100 text-purple-800";
  }
  return "bg-gray-100 text-gray-800";
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
  if (!selectedItem.value || !confirmAction.value) return;

  try {
    if (confirmAction.value === "approve") {
      await setujuiIzin(selectedItem.value.id);
      toast.add({
        title: "Berhasil",
        description: "Izin berhasil disetujui",
        color: "green",
      });
    } else if (confirmAction.value === "reject") {
      await rejectIzin(selectedItem.value.id);
      toast.add({
        title: "Berhasil",
        description: "Izin berhasil ditolak",
        color: "green",
      });
    }
    await fetchIzinData();
  } catch (error) {
    const _ = error;
    toast.add({
      title: "Error",
      description: `Gagal ${confirmAction.value === 'approve' ? 'menyetujui' : 'menolak'} izin.`,
      color: "red",
    });
  } finally {
    handleCancelConfirm();
  }
};

const handleCancelConfirm = () => {
  isConfirmModalOpen.value = false;
  selectedItem.value = null;
  confirmAction.value = null;
};

// Table event handlers
const handlePaginationUpdate = (newPagination) => {
  paginationConfig.value = { ...paginationConfig.value, ...newPagination };
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
      :loading="isLoading"
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
            {{ row.pegawai.nama }}
          </span>
        </div>
      </template>

      <!-- Custom slot for kategori column -->
      <template #kategori-data="{ row }">
        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 capitalize"
          :class="getCategoryClass(row.kategori)"
        >
          {{ row.kategori.replace(/_/g, " ") }}
        </span>
      </template>

      <!-- Custom slot for tanggal column -->
      <template #tanggal-data="{ row }">
        <span class="text-sm text-gray-600"
          >{{ formatDate(row.tanggal_awal) }} -
          {{ formatDate(row.tanggal_akhir) }}</span
        >
      </template>

      <!-- Custom slot for alasan column -->
      <template #alasan-data="{ row }">
        <span class="line-clamp-2 text-sm text-gray-600">{{ row.alasan }}</span>
      </template>

      <!-- Custom slot for status column -->
      <template #status_persetujuan-data="{ row }">
        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
          :class="getStatusClass(row.status_persetujuan)"
        >
          {{ getStatusLabel(row.status_persetujuan) }}
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
          <template v-if="row.status_persetujuan === 'menunggu'">
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
          <a
            v-if="row.lampiran"
            :href="row.lampiran"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UButton
              icon="ph:file-pdf"
              size="sm"
              color="blue"
              variant="soft"
              :ui="{ rounded: 'rounded-full' }"
            />
          </a>
          <span
            v-if="row.status_persetujuan !== 'menunggu' && !row.lampiran"
            class="text-sm text-gray-400"
            >-</span
          >
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
              {{ selectedItem.pegawai.nama }}
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
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize"
              :class="getCategoryClass(selectedItem.kategori)"
            >
              {{ selectedItem.kategori.replace(/_/g, " ") }}
            </span>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Tanggal Izin
            </label>
            <p class="text-gray-900">
              {{ formatDate(selectedItem.tanggal_awal) }} -
              {{ formatDate(selectedItem.tanggal_akhir) }}
            </p>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Status
            </label>
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
              :class="getStatusClass(selectedItem.status_persetujuan)"
            >
              {{ getStatusLabel(selectedItem.status_persetujuan) }}
            </span>
          </div>
          <div v-if="selectedItem.lampiran">
            <label class="mb-1 block text-sm font-medium text-gray-500">
              Lampiran
            </label>
            <a
              :href="selectedItem.lampiran"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              <UIcon name="ph:file-pdf" />
              Lihat Lampiran
            </a>
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
          <template v-if="selectedItem?.status_persetujuan === 'menunggu'">
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
