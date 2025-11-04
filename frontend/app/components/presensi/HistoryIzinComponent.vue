<script setup>
import { computed } from "vue";
import { TEXT } from "@/constants/text";

const presensiapiService = useServicePresensiapi();

const {
  data: izinData,
  status,
  error,
  refresh,
} = await useAsyncData(
  computed(() => `history-izin`),
  async () => {
    const response = await presensiapiService.getAllIzin();
    return response?.data || [];
  },
  {
    default: () => [],
    transform: (data) => data || [],
    server: false,
    lazy: true,
  },
);

const isLoading = computed(() => status.value === "pending");

const sortedIzinData = computed(() => {
  const list = izinData.value || [];
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const dateA = new Date(a.tanggal_awal || 0);
    const dateB = new Date(b.tanggal_awal || 0);
    return dateB - dateA;
  });
});

const getKategoriLabel = (kategori) => {
  const map = {
    dinas_luar: TEXT.dinasLuar,
    cuti_tahunan: TEXT.cutiTahunan,
    cuti_besar: TEXT.cutiBesar,
    cuti_sakit: TEXT.cutiSakit,
    cuti_melahirkan: TEXT.cutiMelahirkan,
    cuti_alasan_penting: TEXT.cutiAlasanPenting,
    cuti_luar_tanggungan_negara: TEXT.cutiLuarTanggunganNegara,
    izin_tidak_masuk: TEXT.izinTidakMasuk,
  };
  return map[kategori] || kategori;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusChipClass = (status) => {
  switch (status?.toLowerCase()) {
    case "diterima":
    case "approved":
      return "bg-green-100 text-green-800 border border-green-200";
    case "pending":
    case "menunggu":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "ditolak":
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200 dark:border-border-main";
  }
};

const getStatusText = (status) => {
  if (!status) return "Menunggu";
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "diterima":
    case "approved":
      return "Diterima";
    case "pending":
    case "menunggu":
      return "Menunggu";
    case "ditolak":
    case "rejected":
      return "Ditolak";
    default:
      return status;
  }
};

const getKategoriColor = (kategori) => {
  const map = {
    dinas_luar: "text-blue-600",
    cuti_tahunan: "text-green-600",
    cuti_besar: "text-purple-600",
    cuti_sakit: "text-orange-600",
    cuti_melahirkan: "text-pink-600",
    cuti_alasan_penting: "text-yellow-600",
    cuti_luar_tanggungan_negara: "text-red-600",
    izin_tidak_masuk: "text-gray-600",
  };
  return map[kategori] || "text-gray-600";
};

const handleOpenLampiran = (lampiran) => {
  window.open(lampiran, "_blank");
};
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header -->

    <!-- Content -->
    <div class="flex-1 overflow-y-auto py-4">
      <LoadingStateComponent v-if="isLoading" />

      <ErrorStateComponent
        v-else-if="error"
        :error="error"
        @refresh="refresh()"
      />

      <EmptyStateComponent
        v-else-if="sortedIzinData.length === 0"
        :text="TEXT.tidakAdaDataIzin"
      />

      <!-- Izin List -->
      <div v-else class="flex flex-col gap-3">
        <CardComponent
          v-for="item in [...sortedIzinData, ...sortedIzinData]"
          :key="item.id || item.tanggal_awal"
        >
          <!-- Header -->
          <div class="mb-3 flex items-start justify-between">
            <div>
              <h4
                :class="getKategoriColor(item.kategori)"
                class="text-sm font-semibold"
              >
                {{ getKategoriLabel(item.kategori) }}
              </h4>
              <p class="text-body-3 text-sm">
                {{ formatDate(item.tanggal_awal) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="getStatusChipClass(item.status)"
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              >
                {{ getStatusText(item.status) }}
              </span>
            </div>
          </div>

          <!-- Detail -->
          <div class="flex flex-col gap-2">
            <!-- Tanggal -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="ph:calendar-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-3 text-sm">{{ TEXT.tanggal }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-body-2 text-sm font-medium">
                  {{ formatDateShort(item.tanggal_awal) }}
                  <span v-if="item.tanggal_akhir !== item.tanggal_awal">
                    - {{ formatDateShort(item.tanggal_akhir) }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Alasan -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="ph:note-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-3 text-sm">{{ TEXT.alasan }}</span>
              </div>
              <div>
                <span class="text-body-2 text-sm font-medium">
                  {{ item.alasan || "-" }}
                </span>
              </div>
            </div>

            <!-- Lampiran -->
            <div
              v-if="item.lampiran || item.nama_lampiran"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <UIcon name="ph:paperclip-bold" class="text-body-3 h-4 w-4" />
                <span class="text-body-3 text-sm">{{ TEXT.lampiran }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ButtonComponent
                  size="sm"
                  class="text-body-2 text-sm font-medium"
                  @click="handleOpenLampiran(item.lampiran)"
                >
                  Buka
                </ButtonComponent>
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  </div>
</template>
