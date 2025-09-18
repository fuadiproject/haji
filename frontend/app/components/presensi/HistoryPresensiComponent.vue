<script setup>
import { ref, computed } from "vue";
import { TEXT } from "@/constants/text";

const bphapiService = useServiceBphapi();

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

const getDateRange = () => {
  const startDate = new Date(selectedYear.value, selectedMonth.value, 1);
  const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0);

  return {
    startDate: startDate.toISOString().split("T")[0], // Format YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // Format YYYY-MM-DD
  };
};

const {
  data: historyData,
  status,
  error,
  refresh,
} = await useAsyncData(
  computed(
    () => `history-presensi-${selectedYear.value}-${selectedMonth.value}`,
  ),
  async () => {
    const { startDate, endDate } = getDateRange();
    const response = await bphapiService.history({ startDate, endDate });
    return response || [];
  },
  {
    watch: [selectedMonth, selectedYear],
    default: () => [],
    transform: (data) => data || [],
    server: false,
    lazy: true,
  },
);

const isLoading = computed(() => status.value === "pending");

const sortedHistoryData = computed(() => {
  if (!historyData.value || !Array.isArray(historyData.value)) return [];
  return historyData.value;
});

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
  // Data akan otomatis refresh karena watch options
};

const formatTime = (timeString) => {
  if (!timeString) return "-";
  return timeString;
};

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
  if (item.jam_datang && item.jam_pulang) {
    return "hadir_lengkap";
  } else if (item.jam_datang) {
    return "hadir_sebagian";
  } else if (item.status === "Libur Sabtu" || item.status === "Libur Minggu") {
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
      return "bg-gray-100 text-gray-800 border border-gray-200";
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
      return item.status; // "Libur Sabtu" atau "Libur Minggu"
    case "tidak_hadir":
      return item.status || "Tidak Hadir";
    default:
      return item.status || "Tidak Hadir";
  }
};

const getPemotonganColor = (pemotongan) => {
  const value = parseFloat(pemotongan);
  if (value === 0) return "text-green-600";
  if (value <= 1) return "text-yellow-600";
  return "text-red-600";
};
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header dengan filter bulan -->
    <div class="border-neutral-9 sticky top-0 z-10 border-b bg-white px-4 py-3">
      <div class="flex items-center justify-between">
        <button
          class="border-neutral-9 flex h-8 w-8 items-center justify-center rounded-full border"
          @click="changeMonth('prev')"
        >
          <UIcon name="ph:caret-left-bold" class="text-neutral-7 h-4 w-4" />
        </button>

        <div class="flex flex-col items-center">
          <h3 class="text-neutral-7 text-base font-semibold">
            {{ selectedMonthName }} {{ selectedYear }}
          </h3>
          <p class="text-neutral-6 text-xs">
            {{ TEXT.riwayatKehadiran }}
          </p>
        </div>

        <button
          class="border-neutral-9 flex h-8 w-8 items-center justify-center rounded-full border"
          @click="changeMonth('next')"
        >
          <UIcon name="ph:caret-right-bold" class="text-neutral-7 h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex h-32 items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <UIcon
            name="ph:spinner-bold"
            class="text-primary-main h-6 w-6 animate-spin"
          />
          <p class="text-neutral-6 text-sm">{{ TEXT.memuatData }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex h-32 items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <UIcon name="ph:warning-bold" class="h-6 w-6 text-red-500" />
          <p class="text-neutral-6 text-center text-sm">{{ error }}</p>
          <button
            class="text-primary-main text-sm font-semibold"
            @click="refresh()"
          >
            {{ TEXT.cobaLagi }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="sortedHistoryData.length === 0"
        class="flex h-32 items-center justify-center"
      >
        <div class="flex flex-col items-center gap-2">
          <NuxtImg
            src="/images/empty-image.svg"
            alt="Empty State"
            class="h-12 w-12"
          />
          <p class="text-neutral-6 text-center text-sm">
            {{ TEXT.tidakAdaDataKehadiranUntukBulanIni }}
          </p>
        </div>
      </div>

      <!-- History List -->
      <div v-else class="flex flex-col gap-3">
        <CardComponent v-for="item in sortedHistoryData" :key="item.tanggal">
          <!-- Header Hari -->
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h4 class="text-neutral-7 text-sm font-semibold">
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
                <span class="text-neutral-6 text-xs">{{ TEXT.clockIn }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="ph:clock-bold" class="text-neutral-6 h-4 w-4" />
                <span class="text-neutral-7 text-xs font-medium">
                  {{ formatTime(item.jam_datang) }}
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
                <span class="text-neutral-6 text-xs">{{ TEXT.clockOut }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="ph:clock-bold" class="text-neutral-6 h-4 w-4" />
                <span class="text-neutral-7 text-xs font-medium">
                  {{ formatTime(item.jam_pulang) }}
                </span>
              </div>
            </div>

            <!-- Pemotongan -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="ph:percent-bold" class="text-neutral-6 h-4 w-4" />
                <span class="text-neutral-6 text-xs">{{
                  TEXT.pemotongan
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="getPemotonganColor(item.pemotongan)"
                  class="text-xs font-medium"
                >
                  {{ item.pemotongan }}%
                </span>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>
