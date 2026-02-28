<script setup>
import { ref, computed } from "vue";
import { TEXT } from "@/constants/text";

const presensiapiService = useServicePresensiapi();

const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const selectedMonthName = computed(() => monthNames[selectedMonth.value]);

const {
  data: historyData,
  status,
  error,
  refresh,
} = await useAsyncData(
  async () => {
    const response = await presensiapiService.rekapKehadiran({
      bulan: selectedMonth.value + 1,
      tahun: selectedYear.value,
    });
    return response?.data || {};
  },
  {
    watch: [selectedMonth, selectedYear],
    default: () => ({}),
    transform: (data) => data || {},
    server: false,
    lazy: true,
  },
);

const isLoading = computed(() => status.value === "pending");

const sortedHistoryData = computed(() => {
  const list = historyData.value?.rekap_harian;
  if (!Array.isArray(list)) return [];
  return list;
});

const infoPegawai = computed(() => historyData.value?.info_pegawai || null);
const summaryBulanan = computed(
  () => historyData.value?.summary_bulanan || null,
);

const changeMonth = (direction) => {
  if (direction === "prev") {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11;
      selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
  } else {
    if (selectedMonth.value === 11) {
      selectedMonth.value = 0;
      selectedYear.value++;
    } else {
      selectedMonth.value++;
    }
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "-";
  return timeString;
};

// const formatCurrency = (amount) => {
//   if (amount == null) return "-";
//   try {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   } catch {
//     return `${amount}`;
//   }
// };

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getAttendanceStatus = (item) => {
  if (item.checkin && item.checkout) {
    return "hadir_lengkap";
  } else if (item.checkin || item.checkout) {
    return "hadir_sebagian";
  } else if (item.status_kehadiran === "Akhir Pekan") {
    return "libur";
  } else {
    return "tidak_hadir";
  }
};

const getStatusChipClass = (status) => {
  switch (status) {
    case "hadir_lengkap":
      return "bg-green-100 text-green-800 border border-green-200";
    case "hadir_sebagian":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "libur":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "tidak_hadir":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200 dark:border-border-main";
  }
};

const getStatusText = (item) => {
  const status = getAttendanceStatus(item);
  switch (status) {
    case "hadir_lengkap":
      return "Hadir Lengkap";
    case "hadir_sebagian":
      return "Hadir Sebagian";
    case "libur":
      return item.status_kehadiran;
    case "tidak_hadir":
      return item.status_kehadiran || "Tidak Hadir";
    default:
      return item.status_kehadiran || "Tidak Hadir";
  }
};

const getPemotonganColor = (pemotongan) => {
  const value = parseFloat(pemotongan);
  if (value === 0) return "text-green-600";
  if (value <= 1) return "text-yellow-600";
  return "text-red-600";
};

const isExporting = ref(false);

const exportToExcel = async () => {
  if (sortedHistoryData.value.length === 0 || isExporting.value) return;
  isExporting.value = true;
  try {
    const XLSX = await import("xlsx");
    const rows = [];

    // Info pegawai
    if (infoPegawai.value) {
      rows.push(["Nama", infoPegawai.value.nama || "-"]);
      rows.push(["NIP", infoPegawai.value.nip || "-"]);
      rows.push([]);
    }

    // Header tabel
    rows.push([
      "Tanggal",
      "Hari",
      "Status",
      TEXT.clockIn,
      TEXT.clockOut,
      TEXT.pemotongan + " (%)",
    ]);

    // Data presensi
    for (const item of sortedHistoryData.value) {
      const dateObj = new Date(item.tanggal);
      const hari = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
      rows.push([
        item.tanggal,
        hari,
        getStatusText(item),
        formatTime(item.checkin),
        formatTime(item.checkout),
        item.persentase_potongan_harian ?? "-",
      ]);
    }

    // Ringkasan bulanan
    if (summaryBulanan.value) {
      rows.push([]);
      rows.push([
        "Persentase Potongan Bulanan",
        `${summaryBulanan.value.persentase_potongan}%`,
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Presensi");

    const fileName = `Riwayat_Presensi_${selectedMonthName.value}_${selectedYear.value}.xlsx`;
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error("Export Excel gagal:", err);
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header dengan filter bulan -->
    <div
      class="border-border-main bg-container-main sticky top-0 z-10 border-b px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <button
          class="border-border-main flex h-8 w-8 items-center justify-center rounded-full border"
          @click="changeMonth('prev')"
        >
          <UIcon name="ph:caret-left-bold" class="text-body-2 h-4 w-4" />
        </button>

        <div class="flex flex-col items-center">
          <h3 class="text-body-2 text-base font-semibold">
            {{ selectedMonthName }} {{ selectedYear }}
          </h3>
          <p class="text-body-3 text-xs">
            {{ TEXT.riwayatKehadiran }}
          </p>
        </div>

        <button
          class="border-border-main flex h-8 w-8 items-center justify-center rounded-full border"
          @click="changeMonth('next')"
        >
          <UIcon name="ph:caret-right-bold" class="text-body-2 h-4 w-4" />
        </button>
      </div>

      <!-- Tombol Export Excel -->
      <div class="mt-3 flex justify-center">
        <button
          type="button"
          class="border-border-main bg-container-main flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || sortedHistoryData.length === 0 || isExporting"
          @click="exportToExcel"
        >
          <UIcon name="ph:file-xls" class="h-4 w-4" />
          {{ isExporting ? "Mengekspor..." : TEXT.exportExcel }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto py-4">
      <LoadingStateComponent v-if="isLoading" />

      <ErrorStateComponent
        v-else-if="error"
        :error="error"
        @refresh="refresh()"
      />

      <EmptyStateComponent
        v-else-if="sortedHistoryData.length === 0"
        :text="TEXT.tidakAdaDataKehadiranUntukBulanIni"
      />

      <!-- History List -->
      <div v-else class="flex flex-col gap-3">
        <!-- Info Pegawai & Ringkasan Bulanan -->
        <CardComponent v-if="infoPegawai || summaryBulanan">
          <div class="flex flex-col gap-2">
            <div v-if="infoPegawai" class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-body-3 text-xs">Nama</span>
                <span class="text-body-2 text-sm font-medium">
                  {{ infoPegawai.nama }}
                </span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-body-3 text-xs">NIP</span>
                <span class="text-body-2 text-sm font-medium">
                  {{ infoPegawai.nip }}
                </span>
              </div>
            </div>
            <!-- <div v-if="infoPegawai" class="flex items-center justify-between">
              <span class="text-body-3 text-xs">Tunjangan Kinerja Awal</span>
              <span class="text-body-2 text-sm font-semibold">
                {{ formatCurrency(infoPegawai.tunkin_awal) }}
              </span>
            </div> -->
            <div v-if="summaryBulanan" class="mt-2 grid grid-cols-3 gap-2">
              <!-- <div class="flex flex-col">
                <span class="text-body-3 text-[10px]">Total Potongan</span>
                <span class="text-body-2 text-xs font-semibold">
                  {{ formatCurrency(summaryBulanan.total_potongan_bulan_ini) }}
                </span>
              </div> -->
              <div class="flex flex-col">
                <span class="text-body-3 text-[10px]">Persentase Potongan</span>
                <span class="text-body-2 text-xs font-semibold">
                  {{ summaryBulanan.persentase_potongan }}%
                </span>
              </div>
              <!-- <div class="flex flex-col text-right">
                <span class="text-body-3 text-[10px]">Tunkin Diterima</span>
                <span class="text-body-2 text-xs font-semibold">
                  {{ formatCurrency(summaryBulanan.tunkin_diterima) }}
                </span>
              </div> -->
            </div>
          </div>
        </CardComponent>

        <CardComponent v-for="item in sortedHistoryData" :key="item.tanggal">
          <!-- Header Hari -->
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h4 class="text-body-2 text-sm font-semibold">
                {{ formatDate(item.tanggal) }}
              </h4>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="getStatusChipClass(getAttendanceStatus(item))"
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              >
                {{ getStatusText(item) }}
              </span>
            </div>
          </div>

          <!-- Detail Absen -->
          <div class="flex flex-col gap-2">
            <!-- Check In -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <NuxtImg
                  src="/images/icons/SignIn.svg"
                  alt="Clock In"
                  class="h-4 w-4"
                />
                <span class="text-body-3 text-xs">{{ TEXT.clockIn }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="ph:clock-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-2 text-xs font-medium">
                  {{ formatTime(item.checkin) }}
                </span>
              </div>
            </div>

            <!-- Check Out -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <NuxtImg
                  src="/images/icons/SignOut.svg"
                  alt="Clock Out"
                  class="h-4 w-4"
                />
                <span class="text-body-3 text-xs">{{ TEXT.clockOut }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="ph:clock-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-2 text-xs font-medium">
                  {{ formatTime(item.checkout) }}
                </span>
              </div>
            </div>

            <!-- Pemotongan -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="ph:percent-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-3 text-xs">{{ TEXT.pemotongan }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="getPemotonganColor(item.persentase_potongan_harian)"
                  class="text-xs font-medium"
                >
                  {{ item.persentase_potongan_harian }}%
                </span>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>
