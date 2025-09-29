<script setup>
import { ref } from "vue";
import { TEXT } from "@/constants/text";
import HistoryPresensiComponent from "@/components/presensi/HistoryPresensiComponent.vue";

definePageMeta({
  title: "Presensi",
  description: "Pantau kehadiran dan absensi pegawai",
});

const bphapiService = useServiceBphapi();

const {
  isModalAbsenConfirm,
  isModalAbsenConfirmType,
  handleAbsen,
  handleCloseModalAbsenConfirm,
  handleConfirmAbsen,
} = useActionPresensi();

const { currentTime, currentDate } = useRealtimeClock();

const isEmpty = ref(false);
const maxJamDatangHariIni = ref("08:00");
const maxJamPulangHariIni = ref("17:00");
const jamDatangHariIni = ref("08:30");
const jamPulangHariIni = ref("17:00");
const isModalHistoryPresensiOpen = ref(false);

const { data: rekapPotonganData } = await useAsyncData(
  computed(() => `rekap-potongan`),
  async () => {
    const response = await bphapiService.rekapPotongan();
    return response || null;
  },
  {
    default: () => null,
    transform: (data) => data || null,
    server: false,
    lazy: true,
  },
);

const persenPemotongan = computed(() => {
  if (!rekapPotonganData.value) return "0";
  return rekapPotonganData.value?.data?.[0]?.persen_pemotongan ?? "0";
});

// Mock attendance stats
const attendanceStats = ref([
  {
    title: "Hadir Hari Ini",
    value: "1,156",
    total: "1,234",
    percentage: 94,
    icon: "ph:check-circle",
    color: "green",
  },
  {
    title: "Terlambat",
    value: "23",
    total: "1,234",
    percentage: 2,
    icon: "ph:clock",
    color: "yellow",
  },
  {
    title: "Tidak Hadir",
    value: "55",
    total: "1,234",
    percentage: 4,
    icon: "ph:x-circle",
    color: "red",
  },
  {
    title: "Izin/Cuti",
    value: "31",
    total: "1,234",
    percentage: 3,
    icon: "ph:calendar-x",
    color: "blue",
  },
]);
</script>

<template>
  <div class="space-y-6">
    <!-- Current Time Section -->
    <div
      class="from-primary-main to-primary-main/80 rounded-lg bg-gradient-to-r p-6 text-white"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 text-center">
          <div class="mb-2 text-sm opacity-90">{{ TEXT.laporanKehadiran }}</div>
          <div class="mb-2 text-4xl font-bold">{{ currentTime }}</div>
          <div class="text-base opacity-90">{{ currentDate }}</div>
        </div>
        <NuxtImg
          src="/images/reminder-image.svg"
          alt="Clock Image"
          class="h-20 w-20"
        />
      </div>

      <!-- Personal Attendance Actions -->
      <div class="mt-6 rounded-lg bg-white/10 p-4">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">{{ TEXT.jadwalKerja }}:</p>
            <p class="font-semibold">
              {{ TEXT.stafKhusus }}: {{ TEXT.stafKhususDescription }}
            </p>
          </div>
          <div class="text-right text-sm">
            <div class="opacity-90">{{ TEXT.persenPemotongan }}:</div>
            <div class="text-secondary-main font-bold">
              {{ persenPemotongan }}%
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <ButtonComponent
            class="text-primary-main flex-1 bg-white hover:bg-gray-50"
            @click="handleAbsen('absenMasuk')"
          >
            <NuxtImg
              src="/images/icons/SignIn.svg"
              alt="Clock In"
              class="h-4 w-4"
            />
            {{ TEXT.clockIn }}
          </ButtonComponent>

          <ButtonComponent
            class="flex-1 bg-white/20 text-white hover:bg-white/30"
            @click="handleAbsen('absenKeluar')"
          >
            {{ TEXT.clockOut }}
            <NuxtImg
              src="/images/icons/SignOutWhite.svg"
              alt="Clock Out"
              class="h-4 w-4"
            />
          </ButtonComponent>
        </div>
      </div>
    </div>

    <!-- Attendance Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in attendanceStats"
        :key="stat.title"
        class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">
              {{ stat.title }}
            </p>
            <p class="text-gray-title text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-gray-4 text-xs">dari {{ stat.total }} pegawai</p>
          </div>
          <div
            :class="{
              'bg-green-100': stat.color === 'green',
              'bg-yellow-100': stat.color === 'yellow',
              'bg-red-100': stat.color === 'red',
              'bg-blue-100': stat.color === 'blue',
            }"
            class="rounded-lg p-3"
          >
            <UIcon
              :name="stat.icon"
              :class="{
                'text-green-600': stat.color === 'green',
                'text-yellow-600': stat.color === 'yellow',
                'text-red-600': stat.color === 'red',
                'text-blue-600': stat.color === 'blue',
              }"
              class="h-6 w-6"
            />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-4 text-sm">{{ stat.percentage }}%</span>
            <div class="bg-neutral-9 h-2 w-20 rounded-full">
              <div
                :class="{
                  'bg-green-600': stat.color === 'green',
                  'bg-yellow-600': stat.color === 'yellow',
                  'bg-red-600': stat.color === 'red',
                  'bg-blue-600': stat.color === 'blue',
                }"
                class="h-2 rounded-full transition-all duration-300"
                :style="{ width: stat.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Attendance History -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-gray-title text-lg font-semibold">
          {{ TEXT.riwayatKehadiran }} Anda
        </h2>
        <button
          class="text-primary-main hover:text-primary-main/80 text-sm font-semibold"
          @click="isModalHistoryPresensiOpen = true"
        >
          {{ TEXT.lihatSemua }}
        </button>
      </div>

      <div
        v-if="isEmpty"
        class="flex flex-col items-center justify-center py-12"
      >
        <NuxtImg
          src="/images/empty-image.svg"
          alt="Empty State"
          class="mb-4 h-20 w-20"
        />
        <p class="text-gray-4">{{ TEXT.belumAdaDataKehadiranHariIni }}</p>
      </div>

      <div v-else class="space-y-4">
        <CardComponent class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-green-100 p-2">
              <NuxtImg
                src="/images/icons/SignIn.svg"
                alt="Clock In"
                class="h-5 w-5"
              />
            </div>
            <div>
              <p class="text-gray-title font-semibold">{{ TEXT.clockIn }}</p>
              <p class="text-gray-4 text-sm">Hari ini</p>
            </div>
          </div>
          <div class="text-right">
            <div
              class="bg-neutral-2 flex items-center gap-2 rounded-lg px-3 py-2"
            >
              <UIcon
                name="ph:clock-bold"
                class="h-4 w-4"
                :class="{
                  'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  'text-gray-600': jamDatangHariIni <= maxJamDatangHariIni,
                }"
              />
              <span
                class="text-sm font-medium"
                :class="{
                  'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  'text-gray-600': jamDatangHariIni <= maxJamDatangHariIni,
                }"
              >
                {{ jamDatangHariIni }}
              </span>
            </div>
            <p
              v-if="jamDatangHariIni > maxJamDatangHariIni"
              class="mt-1 text-xs text-red-500"
            >
              Terlambat
            </p>
          </div>
        </CardComponent>

        <CardComponent class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-blue-100 p-2">
              <NuxtImg
                src="/images/icons/SignOut.svg"
                alt="Clock Out"
                class="h-5 w-5"
              />
            </div>
            <div>
              <p class="text-gray-title font-semibold">{{ TEXT.clockOut }}</p>
              <p class="text-gray-4 text-sm">Hari ini</p>
            </div>
          </div>
          <div class="text-right">
            <div
              class="bg-neutral-2 flex items-center gap-2 rounded-lg px-3 py-2"
            >
              <UIcon
                name="ph:clock-bold"
                class="h-4 w-4"
                :class="{
                  'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  'text-gray-600': jamPulangHariIni >= maxJamPulangHariIni,
                }"
              />
              <span
                class="text-sm font-medium"
                :class="{
                  'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  'text-gray-600': jamPulangHariIni >= maxJamPulangHariIni,
                }"
              >
                {{ jamPulangHariIni }}
              </span>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>

    <!-- Modals -->
    <ModalConfirmComponent
      :is-open="isModalAbsenConfirm"
      :title="
        isModalAbsenConfirmType === 'absenMasuk'
          ? TEXT.konfirmasiAbsenMasuk
          : TEXT.konfirmasiAbsenKeluar
      "
      :buttons="[
        {
          variant: 'primary',
          text:
            isModalAbsenConfirmType === 'absenMasuk'
              ? TEXT.yaAbsenMasuk
              : TEXT.yaAbsenKeluar,
        },
        {
          variant: 'secondary',
          text: TEXT.batal,
        },
      ]"
      @confirm="handleConfirmAbsen(isModalAbsenConfirmType)"
      @cancel="handleCloseModalAbsenConfirm"
      @close="handleCloseModalAbsenConfirm"
    >
      <div>{{ TEXT.apakahAndaYakinInginMelakukanAbsen }}</div>
    </ModalConfirmComponent>

    <ModalBottomComponent
      :is-open="isModalHistoryPresensiOpen"
      :title="TEXT.riwayatKehadiran"
      :is-full-height="true"
      @close="isModalHistoryPresensiOpen = false"
    >
      <HistoryPresensiComponent />
    </ModalBottomComponent>
  </div>
</template>
