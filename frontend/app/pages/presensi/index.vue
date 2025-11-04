<script setup>
import { ref } from "vue";
import { TEXT } from "@/constants/text";
import HistoryPresensiComponent from "@/components/presensi/HistoryPresensiComponent.vue";
import HistoryIzinComponent from "@/components/presensi/HistoryIzinComponent.vue";
import ModalCreateIzinComponent from "@/components/presensi/ModalCreateIzinComponent.vue";

const presensiapiService = useServicePresensiapi();

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
const isModalHistoryPresensiOpen = ref(false);
const isModalCreateIzinOpen = ref(false);
const isModalHistoryIzinOpen = ref(false);
const refreshIzinKey = ref(0);

const { data: historyData } = await useAsyncData(
  computed(
    () =>
      `history-presensi-${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
  ),
  async () => {
    const response = await presensiapiService.rekapKehadiran({
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
    });
    return response?.data || {};
  },
  {
    default: () => ({}),
    transform: (data) => data || {},
    server: false,
    lazy: true,
  },
);

const { data: historyTodayData, refresh: refreshHistoryToday } =
  await useAsyncData(
    computed(() => `history-today`),
    async () => {
      const response = await presensiapiService.historyToday();
      return response?.data || [];
    },
    {
      default: () => ({}),
      transform: (data) => data || {},
      server: false,
      lazy: true,
    },
  );

const jamDatangHariIni = computed(() => {
  const items = historyTodayData.value || [];
  const checkin = Array.isArray(items)
    ? items.find((item) => item?.tipe === "checkin")
    : null;
  return checkin?.local_time || "--:--";
});
const jamPulangHariIni = computed(() => {
  const items = historyTodayData.value || [];
  const checkout = Array.isArray(items)
    ? items.find((item) => item?.tipe === "checkout")
    : null;
  return checkout?.local_time || "--:--";
});

const persenPemotongan = computed(() => {
  if (!historyData.value) return "0";
  return historyData.value?.summary_bulanan?.persentase_potongan || "0";
});

const handleBack = () => {
  navigateTo("/");
};

const handleRefreshIzin = () => {
  refreshIzinKey.value++;
};
</script>

<template>
  <TemplateDetailComponent
    variant="not-default"
    :title="TEXT.presensi"
    @back="handleBack"
  >
    <div class="flex w-full flex-col items-center justify-center gap-3">
      <div class="text-body-2 text-base font-semibold">
        {{ TEXT.laporanKehadiran }}
      </div>

      <div class="text-primary-main text-[40px] leading-10 font-bold">
        {{ currentTime }}
      </div>

      <div class="text-body-3 text-base font-normal">
        {{ currentDate }}
      </div>
    </div>

    <div
      class="bg-body-10 dark:bg-container-main mt-6 flex flex-col gap-4 rounded-xl p-4"
    >
      <div class="flex flex-col items-center gap-2">
        <p class="text-body-3 text-sm leading-4 font-medium">
          {{ TEXT.jadwalKerja }}:
        </p>
        <p class="text-body-2 text-base font-semibold">
          {{ TEXT.stafKhususDescription }}
        </p>
      </div>

      <div
        class="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2"
      >
        <ButtonComponent
          class="min-w-fit flex-1 text-xs"
          @click="handleAbsen('absenMasuk')"
        >
          <NuxtImg
            src="/images/icons/SignInWhite.svg"
            alt="Clock In"
            class="h-3 w-3"
          />
          {{ TEXT.clockIn }}
        </ButtonComponent>

        <ButtonComponent
          class="min-w-fit flex-1 text-xs"
          @click="handleAbsen('absenKeluar')"
        >
          {{ TEXT.clockOut }}
          <NuxtImg
            src="/images/icons/SignOutWhite.svg"
            alt="Clock Out"
            class="h-3 w-3"
          />
        </ButtonComponent>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="ph:info-bold" class="text-body-3 h-4 w-4" />
          <p class="text-body-3 text-xs leading-4">
            {{ TEXT.infoKehadiran }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="ph:percent-bold" class="text-primary-main h-4 w-4" />
          <p class="text-body-3 text-xs leading-4 font-medium">
            {{ TEXT.persenPemotongan }}:
          </p>
          <p class="text-primary-main text-xs font-semibold">
            {{ persenPemotongan }}%
          </p>
        </div>
      </div>
    </div>

    <div
      class="mt-6 flex flex-col gap-2.5 rounded-lg border border-dashed border-neutral-300 p-4"
    >
      <div class="flex items-center justify-between gap-2 p-2">
        <div class="flex items-center gap-2">
          <UIcon
            name="ph:clock-counter-clockwise-bold"
            class="text-body-2 h-5 w-5"
          />
          <p class="text-body-2 text-base leading-4 font-semibold">
            {{ TEXT.riwayatKehadiran }}
          </p>
        </div>

        <button
          class="text-primary-main text-sm font-semibold"
          @click="isModalHistoryPresensiOpen = true"
        >
          {{ TEXT.lihatSemua }}
        </button>
      </div>

      <div
        v-if="isEmpty"
        class="flex h-50 w-full flex-col items-center justify-center gap-4"
      >
        <NuxtImg
          src="/images/empty-image.svg"
          alt="Empty State"
          class="h-20 w-20"
        />
        <p class="text-body-3 text-sm leading-4">
          {{ TEXT.belumAdaDataKehadiranHariIni }}
        </p>
      </div>

      <div v-else>
        <div class="flex flex-col gap-4">
          <CardComponent class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtImg
                src="/images/icons/SignIn.svg"
                alt="Clock In"
                class="h-6 w-6"
              />
              <p
                class="text-body-2 text-sm leading-4 font-semibold tracking-wide"
              >
                {{ TEXT.clockIn }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="bg-body-9 dark:bg-container-main flex items-center gap-2 rounded-lg px-3 py-2"
              >
                <UIcon
                  name="ph:clock-bold"
                  class="h-5 w-5 text-gray-600"
                  :class="{
                    'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  }"
                />
                <span
                  class="text-sm font-medium text-gray-600"
                  :class="{
                    'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  }"
                  >{{ jamDatangHariIni }}</span
                >
              </div>
            </div>
          </CardComponent>

          <CardComponent class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtImg
                src="/images/icons/SignOut.svg"
                alt="Clock Out"
                class="h-6 w-6"
              />
              <p
                class="text-body-2 text-sm leading-4 font-semibold tracking-wide"
              >
                {{ TEXT.clockOut }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="bg-body-9 dark:bg-container-main flex items-center gap-2 rounded-lg px-3 py-2"
              >
                <UIcon
                  name="ph:clock-bold"
                  class="h-5 w-5 text-gray-600"
                  :class="{
                    'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  }"
                />
                <span
                  class="text-sm font-medium text-gray-600"
                  :class="{
                    'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  }"
                  >{{ jamPulangHariIni }}</span
                >
              </div>
            </div>
          </CardComponent>
        </div>
      </div>
    </div>

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
          text:
            isModalAbsenConfirmType === 'absenMasuk' ? TEXT.batal : TEXT.batal,
        },
      ]"
      @confirm="
        handleConfirmAbsen(isModalAbsenConfirmType, () => {
          refreshHistoryToday();
        })
      "
      @cancel="handleCloseModalAbsenConfirm"
      @close="handleCloseModalAbsenConfirm"
    >
      <div>{{ TEXT.apakahAndaYakinInginMelakukanAbsen }}</div>
    </ModalConfirmComponent>

    <!-- Section Izin -->
    <div
      class="mt-6 flex flex-col gap-2.5 rounded-lg border border-dashed border-neutral-300 p-4"
    >
      <div class="flex items-center justify-between gap-2 p-2">
        <div class="flex items-center gap-2">
          <UIcon name="ph:calendar-check-bold" class="text-body-2 h-5 w-5" />
          <p class="text-body-2 text-base leading-4 font-semibold">
            {{ TEXT.izin }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="text-primary-main text-sm font-semibold"
            @click="isModalHistoryIzinOpen = true"
          >
            {{ TEXT.lihatSemua }}
          </button>
        </div>
      </div>

      <ButtonComponent class="w-full" @click="isModalCreateIzinOpen = true">
        {{ TEXT.buatIzin }}
      </ButtonComponent>
    </div>

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
          text:
            isModalAbsenConfirmType === 'absenMasuk' ? TEXT.batal : TEXT.batal,
        },
      ]"
      @confirm="
        handleConfirmAbsen(isModalAbsenConfirmType, () => {
          refreshHistoryToday();
        })
      "
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

    <ModalCreateIzinComponent
      :is-open="isModalCreateIzinOpen"
      @close="isModalCreateIzinOpen = false"
      @refresh="handleRefreshIzin"
    />

    <ModalBottomComponent
      :is-open="isModalHistoryIzinOpen"
      :title="TEXT.riwayatIzin"
      :is-full-height="true"
      @close="isModalHistoryIzinOpen = false"
    >
      <HistoryIzinComponent :key="refreshIzinKey" />
    </ModalBottomComponent>
  </TemplateDetailComponent>
</template>
