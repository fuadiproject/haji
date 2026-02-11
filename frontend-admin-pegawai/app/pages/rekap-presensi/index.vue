<script setup>
definePageMeta({
  title: "Rekap Presensi",
  description: "Lihat rekap presensi pegawai",
});

const { user, hasRole } = useAuth();
const { getAllKantor, getRekapSatker, getSatkerByKode } = usePresensiApi();
const toast = useToast();

const isAdminPusat = hasRole("admin");

// Loading states
const isLoading = ref(false);
const isLoadingKantor = ref(false);

// Modal state
const isDetailModalOpen = ref(false);
const selectedItem = ref(null);

// Filter state
const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth() + 1);
const selectedYear = ref(currentDate.getFullYear());
const selectedSatker = ref(null);

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

// Dynamic satker options from API
const satkerOptions = ref([]);

// Data
const presensiData = ref([]);

const namaSatker = ref();

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
    width: "22%",
  },
  {
    key: "total_hari_kerja",
    label: "Total Hari Kerja",
    width: "15%",
    headerClass: "text-center",
  },
  {
    key: "total_pelanggaran",
    label: "Total Pelanggaran",
    width: "15%",
    headerClass: "text-center",
  },
  {
    key: "persentase_potongan",
    label: "Persentase Potongan",
    width: "15%",
    headerClass: "text-center",
  },
  {
    key: "actions",
    label: "Aksi",
    width: "10%",
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
    no: index + 1,
    nip: item.nip,
    nama: item.nama,
    total_hari_kerja: item.summary_bulanan?.total_hari_kerja || 0,
    total_pelanggaran: item.summary_bulanan?.total_pelanggaran || 0,
    persentase_potongan: item.summary_bulanan?.persentase_potongan || 0,
  }));
});

const selectedMonthLabel = computed(() => {
  const month = monthOptions.find((m) => m.value === selectedMonth.value);
  return month?.label || "";
});

const selectedSatkerLabel = computed(() => {
  if (isAdminPusat) {
    const satker = satkerOptions.value.find((s) => s.value === selectedSatker.value);
    return satker?.label || "";
  }
  return user.value?.kode_satker || "";
});

const fetchNamaSatkerByKode = async() => {
   try {
    const response = await getSatkerByKode(user.value?.kode_satker);

    namaSatker.value = (response?.data || response)?.nama;
    
  } catch (error) {
    const _ = error
    toast.add({
      title: "Error",
      description: "Gagal memuat data satker",
      color: "error",
    });
  }
};

// Helper functions
const getPotonganColor = (percentage) => {
  if (percentage === 0) return "text-green-600";
  if (percentage <= 50) return "text-yellow-600";
  return "text-red-600";
};

// Fetch kantor list from API (for admin_pusat)
const fetchKantor = async () => {
  isLoadingKantor.value = true;
  try {
    const response = await getAllKantor();
    satkerOptions.value =
      (response?.data || response)?.map((kantor) => ({
        label: kantor.nama,
        value: kantor.kode_satker,
      })) || [];
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

// Fetch rekap data from API
const fetchRekapPresensi = async () => {
  // For admin_pusat, wait until satker is selected
  if (isAdminPusat && !selectedSatker.value) {
    presensiData.value = [];
    return;
  }

  isLoading.value = true;
  try {
    // Determine kode_satker based on role
    const kodeSatker = isAdminPusat
      ? selectedSatker.value
      : user.value?.kode_satker;

    // Format month as 2-digit string
    const bulan = String(selectedMonth.value).padStart(2, "0");
    const tahun = String(selectedYear.value);

    const response = await getRekapSatker(kodeSatker, bulan, tahun);
    presensiData.value = response?.data || [];
  } catch (error) {
    const _ = error
    toast.add({
      title: "Error",
      description: "Gagal memuat data rekap presensi",
      color: "error",
    });
    presensiData.value = [];
  } finally {
    isLoading.value = false;
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

const handleExportExcel = async () => {
  if (tableData.value.length === 0) {
    toast.add({
      title: "Info",
      description: "Tidak ada data untuk di-export",
      color: "warning",
    });
    return;
  }

  // Prepare data for export
  const exportData = tableData.value.map((item) => ({
    "No": item.no,
    "NIP": item.nip,
    "Nama": item.nama,
    "Total Hari Kerja": item.total_hari_kerja,
    "Total Pelanggaran": item.total_pelanggaran,
    "Presentase Potongan": `${item.persentase_potongan}%`,
  }));

  // Create workbook and worksheet
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Presensi");

  // Generate filename
  const monthLabel = selectedMonthLabel.value.toLowerCase();  
  let satkerName = namaSatker;
  if (isAdminPusat) {
    satkerName = selectedSatkerLabel
  }
  satkerName =  satkerName.value.toLowerCase().replace(/\s+/g, "_");
  const fileName = `rekap_presensi_${monthLabel}_${selectedYear.value}_${satkerName}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fileName);
};

// Table event handlers
const handlePaginationUpdate = (newPagination) => {
  paginationConfig.value = { ...newPagination };
};

// Watch filters and fetch on change
watch([selectedMonth, selectedYear, selectedSatker], () => {
  fetchRekapPresensi();
});

// Initialize on mount
onMounted(async () => {
  if (isAdminPusat) {
    await fetchKantor();
    if (satkerOptions.value.length > 0) {
      selectedSatker.value = satkerOptions.value[0].value;
    }    
  }else {
    await fetchNamaSatkerByKode();
  }

  
  fetchRekapPresensi();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <!-- <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title text-2xl font-bold">Rekap Presensi</h1>
        </div>
      </div>
    </div> -->

    <!-- Filter Section -->
    <div class="border-neutral-9 rounded-lg border bg-white p-3 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">
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
          <USelect
            v-model="selectedSatker"
            :items="satkerOptions"
            :loading="isLoadingKantor"
            :disabled="isLoadingKantor"
            placeholder="Pilih Satker"
            size="lg"
            class="w-full"
          />
        </div>

        <div v-else class="flex items-end">
          <div
            class="flex items-end gap-2 rounded-lg bg-gray-100 px-3 py-2"
          >
            <UIcon name="ph:buildings" class="h-4 w-4 text-gray-600" />
            <span class="text-sm text-gray-600">
              Satker: {{ namaSatker }}
            </span>
          </div>
        </div>

         <div class="ml-auto">
          <UButton color="primary" size="lg" icon="ph:export" @click="handleExportExcel">
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
            {{ row.nama }}
          </span>
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

      <!-- Custom slot for total_pelanggaran column -->
      <template #total_pelanggaran-data="{ row }">
        <div class="text-center">
          <span
            class="text-sm font-medium"
            :class="row.total_pelanggaran > 0 ? 'text-red-600' : 'text-green-600'"
          >
            {{ row.total_pelanggaran }}
          </span>
        </div>
      </template>

      <!-- Custom slot for persentase_potongan column -->
      <template #persentase_potongan-data="{ row }">
        <div class="text-center">
          <span
            class="text-sm font-medium"
            :class="getPotonganColor(row.persentase_potongan)"
          >
            {{ row.persentase_potongan }}%
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
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">
              {{ selectedItem.total_hari_kerja }}
            </p>
            <p class="text-sm text-blue-700">Total Hari Kerja</p>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p class="text-2xl font-bold text-red-600">
              {{ selectedItem.total_pelanggaran }}
            </p>
            <p class="text-sm text-red-700">Total Pelanggaran</p>
          </div>
          <div
            class="rounded-lg border p-4 text-center"
            :class="
              selectedItem.persentase_potongan === 0
                ? 'border-green-200 bg-green-50'
                : selectedItem.persentase_potongan <= 50
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-red-200 bg-red-50'
            "
          >
            <p
              class="text-2xl font-bold"
              :class="getPotonganColor(selectedItem.persentase_potongan)"
            >
              {{ selectedItem.persentase_potongan }}%
            </p>
            <p
              class="text-sm"
              :class="
                selectedItem.persentase_potongan === 0
                  ? 'text-green-700'
                  : selectedItem.persentase_potongan <= 50
                    ? 'text-yellow-700'
                    : 'text-red-700'
              "
            >
              Persentase Potongan
            </p>
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
