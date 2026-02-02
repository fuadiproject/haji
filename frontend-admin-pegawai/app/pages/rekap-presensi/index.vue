<script setup>
definePageMeta({
  title: "Rekap Presensi",
  description: "Lihat rekap presensi pegawai",
});

const { user, hasRole } = useAuth();

const isAdminPusat = hasRole("admin_pusat");

// Modal state
const isDetailModalOpen = ref(false);
const selectedItem = ref(null);

// Filter state
const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth() + 1);
const selectedYear = ref(currentDate.getFullYear());
const selectedSatker = ref("all");

// Filter options
const monthOptions = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

const yearOptions = [
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
];

const satkerOptions = [
  { label: "Semua Satker", value: "all" },
  { label: "Sekretariat Jenderal", value: "01000000" },
  { label: "Inspektorat Jenderal", value: "02000000" },
  { label: "Direktorat Jenderal Penyelenggaraan Haji", value: "03000000" },
];

// Data
const presensiData = ref([
  {
    nip: "199001012020011001",
    nama: "Ahmad Fauzi",
    hadir: 20,
    izin: 1,
    sakit: 1,
    alfa: 0,
    total_hari_kerja: 22,
  },
  {
    nip: "199203152021012002",
    nama: "Siti Rahayu",
    hadir: 21,
    izin: 0,
    sakit: 1,
    alfa: 0,
    total_hari_kerja: 22,
  },
  {
    nip: "198807202019031003",
    nama: "Budi Santoso",
    hadir: 19,
    izin: 2,
    sakit: 0,
    alfa: 1,
    total_hari_kerja: 22,
  },
  {
    nip: "199505102022011004",
    nama: "Dewi Lestari",
    hadir: 22,
    izin: 0,
    sakit: 0,
    alfa: 0,
    total_hari_kerja: 22,
  },
  {
    nip: "199112252020021005",
    nama: "Rizki Pratama",
    hadir: 18,
    izin: 1,
    sakit: 2,
    alfa: 1,
    total_hari_kerja: 22,
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
    width: "18%",
  },
  {
    key: "nama",
    label: "Nama",
    width: "20%",
  },
  {
    key: "hadir",
    label: "Hadir",
    width: "10%",
    headerClass: "text-center",
  },
  {
    key: "izin",
    label: "Izin",
    width: "10%",
    headerClass: "text-center",
  },
  {
    key: "sakit",
    label: "Sakit",
    width: "10%",
    headerClass: "text-center",
  },
  {
    key: "alfa",
    label: "Alfa",
    width: "10%",
    headerClass: "text-center",
  },
  {
    key: "total_hari_kerja",
    label: "Total Hari Kerja",
    width: "12%",
    headerClass: "text-center",
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
  return presensiData.value.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
});

const selectedMonthLabel = computed(() => {
  const month = monthOptions.find((m) => m.value === selectedMonth.value);
  return month?.label || "";
});

// Helper functions
const getAttendancePercentage = (item) => {
  if (!item || item.total_hari_kerja === 0) return 0;
  return Math.round((item.hadir / item.total_hari_kerja) * 100);
};

const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return "text-green-600";
  if (percentage >= 75) return "text-yellow-600";
  return "text-red-600";
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
          <h1 class="text-gray-title text-2xl font-bold">Rekap Presensi</h1>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="border-neutral-9 rounded-lg border bg-white p-3 shadow-sm">
      <div class="flex flex-wrap items-center gap-4">
        <div class="w-40">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Bulan
          </label>
          <USelect v-model="selectedMonth" :items="monthOptions" size="lg" class="w-full" />
        </div>
        <div class="w-32">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Tahun
          </label>
          <USelect v-model="selectedYear" :items="yearOptions" size="lg" class="w-full" />
        </div>
        <div v-if="isAdminPusat" class="w-72">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Satker
          </label>
          <USelect v-model="selectedSatker" :items="satkerOptions" size="lg" class="w-full" />
        </div>
        <div v-else class="flex items-end pb-2">
          <div
            class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
          >
            <UIcon name="ph:buildings" class="h-4 w-4 text-gray-600" />
            <span class="text-sm text-gray-600">
              Satker: {{ user?.nama_satker }}
            </span>
          </div>
        </div>

         <div class="ml-auto">
          <UButton color="primary" size="lg" icon="ph:export">
            Export
          </UButton>
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

      <!-- Custom slot for hadir column -->
      <template #hadir-data="{ row }">
        <div class="text-center">
          <span class="text-sm font-medium text-green-600">{{ row.hadir }}</span>
        </div>
      </template>

      <!-- Custom slot for izin column -->
      <template #izin-data="{ row }">
        <div class="text-center">
          <span class="text-sm font-medium text-blue-600">{{ row.izin }}</span>
        </div>
      </template>

      <!-- Custom slot for sakit column -->
      <template #sakit-data="{ row }">
        <div class="text-center">
          <span class="text-sm font-medium text-yellow-600">
            {{ row.sakit }}
          </span>
        </div>
      </template>

      <!-- Custom slot for alfa column -->
      <template #alfa-data="{ row }">
        <div class="text-center">
          <span class="text-sm font-medium text-red-600">{{ row.alfa }}</span>
        </div>
      </template>

      <!-- Custom slot for total_hari_kerja column -->
      <template #total_hari_kerja-data="{ row }">
        <div class="text-center">
          <span class="text-sm font-medium text-gray-900">
            {{ row.total_hari_kerja }}
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
            @click="handleViewDetail(row)"
          />
        </div>
      </template>
    </DataTableComponent>

    <!-- Detail Modal -->
    <ModalComponent
      v-model:is-open="isDetailModalOpen"
      title="Detail Presensi"
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

        <!-- Period Info -->
        <div class="rounded-lg bg-gray-50 p-4">
          <p class="text-sm text-gray-600">
            Periode: <span class="font-semibold text-gray-900">{{ selectedMonthLabel }} {{ selectedYear }}</span>
          </p>
        </div>

        <!-- Attendance Summary -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p class="text-2xl font-bold text-green-600">
              {{ selectedItem.hadir }}
            </p>
            <p class="text-sm text-green-700">Hadir</p>
          </div>
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">
              {{ selectedItem.izin }}
            </p>
            <p class="text-sm text-blue-700">Izin</p>
          </div>
          <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
            <p class="text-2xl font-bold text-yellow-600">
              {{ selectedItem.sakit }}
            </p>
            <p class="text-sm text-yellow-700">Sakit</p>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p class="text-2xl font-bold text-red-600">
              {{ selectedItem.alfa }}
            </p>
            <p class="text-sm text-red-700">Alfa</p>
          </div>
        </div>

        <!-- Attendance Percentage -->
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Persentase Kehadiran</p>
              <p class="text-sm text-gray-500">
                {{ selectedItem.hadir }} dari {{ selectedItem.total_hari_kerja }} hari kerja
              </p>
            </div>
            <p
              class="text-3xl font-bold"
              :class="getAttendanceColor(getAttendancePercentage(selectedItem))"
            >
              {{ getAttendancePercentage(selectedItem) }}%
            </p>
          </div>
          <!-- Progress Bar -->
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="
                getAttendancePercentage(selectedItem) >= 90
                  ? 'bg-green-500'
                  : getAttendancePercentage(selectedItem) >= 75
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              "
              :style="{ width: `${getAttendancePercentage(selectedItem)}%` }"
            />
          </div>
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
        </div>
      </template>
    </ModalComponent>
  </div>
</template>
