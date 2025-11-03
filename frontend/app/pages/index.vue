<script setup>
import { TEXT } from "@/constants/text";
import WelcomeBannerComponent from "@/components/home/WelcomeBannerComponent.vue";
import BannerSliderComponent from "@/components/home/BannerSliderComponent.vue";

const {
  isModalAbsenConfirm,
  isModalAbsenConfirmType,
  handleAbsen,
  handleCloseModalAbsenConfirm,
  handleConfirmAbsen,
} = useActionPresensi();

const { isDark } = useTheme();

const { getBanner } = useServiceSuperappApi();

const currentBannerIndex = ref(0);
const isModalOpen = ref(false);

const mainMenu = [
  {
    id: "Kepegawaian",
    name: TEXT.kepegawaian,
    icon: "Users",
    to: "/kepegawaian",
  },
  {
    id: "Presensi",
    name: TEXT.presensi,
    icon: "ClockUser",
    to: "/presensi",
  },
  {
    id: "Persuratan",
    name: TEXT.persuratan,
    icon: "EnvelopeSimple",
    to: "/persuratan",
  },
  {
    id: "SOP",
    name: TEXT.sop,
    icon: "Files",
    to: "/sop",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
];

const { data: bannerDataList } = await useAsyncData(
  "banner-data-list",
  () => getBanner(),
  {
    default: () => [],
    transform: (data) => data || [],
    server: false,
    lazy: true,
  },
);

const bannerList = computed(() => {
  if (!bannerDataList.value?.data || !Array.isArray(bannerDataList.value.data))
    return [];

  const newBannerList = bannerDataList?.value?.data?.map((banner) => ({
    id: banner.id,
    src: isDark.value ? banner.dark_image : banner.light_image,
    description: banner.description,
    link: banner.link,
  }));

  const defaultBannerList = [
    {
      id: "welcome-banner",
      component: WelcomeBannerComponent,
    },
  ];

  return [...defaultBannerList, ...newBannerList];
});

const goToBanner = (index) => {
  currentBannerIndex.value = index;
};
</script>

<template>
  <ClientOnly>
    <div
      class="from-primary-4 to-primary-3 mx-auto h-screen max-w-[1027px] overflow-y-auto bg-gradient-to-l"
    >
      <!-- Banner Slider -->
      <div class="relative h-[260px] w-full sm:h-[360px] lg:h-[400px]">
        <BannerSliderComponent
          v-model:current-index="currentBannerIndex"
          :banners="bannerList"
          :auto-play="true"
          :interval="5000"
        />

        <!-- Indicator Dots -->
        <div
          v-if="bannerList.length > 1"
          class="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2"
        >
          <button
            v-for="(banner, index) in bannerList"
            :key="`indicator-${banner.id}`"
            class="transition-all duration-300"
            :class="{
              'bg-primary-main h-2 w-8 rounded-full':
                index === currentBannerIndex,
              'bg-primary-main/50 h-2 w-2 rounded-full':
                index !== currentBannerIndex,
            }"
            @click="goToBanner(index)"
          />
        </div>
      </div>

      <!-- Reminder (Presensi) -->
      <div
        class="bg-container-main relative -mt-7.5 h-[calc(100vh-230px)] min-h-[450px] w-full rounded-t-3xl px-4 py-6"
      >
        <div
          class="bg-body-10 dark:bg-container-secondary relative rounded-2xl px-4 py-6"
        >
          <NuxtImg
            src="/images/reminder-image.svg"
            alt="Reminder Image"
            class="absolute -top-4 right-1 h-[75px] w-[78px]"
          />
          <p class="text-body-2 text-base leading-4 font-medium">
            Halo, Abdurrahman!
          </p>
          <p class="text-body-4 mt-2.5 text-sm leading-4">
            {{ TEXT.reminderDescription }}
          </p>
          <div
            class="mt-4 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <ButtonComponent
              class="min-w-max flex-1"
              @click="handleAbsen('absenMasuk')"
            >
              <NuxtImg
                src="/images/icons/SignInWhite.svg"
                alt="Clock In"
                class="h-5 w-5"
              />
              {{ TEXT.clockIn }}
            </ButtonComponent>

            <ButtonComponent
              class="min-w-max flex-1"
              @click="handleAbsen('absenKeluar')"
            >
              {{ TEXT.clockOut }}
              <NuxtImg
                src="/images/icons/SignOutWhite.svg"
                alt="Clock Out"
                class="h-5 w-5"
              />
            </ButtonComponent>
          </div>
        </div>

        <!-- Main Menu -->
        <div class="mt-4.5 grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="menu in mainMenu.slice(0, 5)"
            :key="menu.id"
            class="border-border-main bg-container-secondary flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border"
            :to="menu.to"
          >
            <NuxtImg
              :src="`/images/icons/${menu.icon}.svg`"
              alt="Menu Icon"
              class="h-7 w-7"
            />
            <span class="text-body-4 text-center text-xs">{{ menu.name }}</span>
          </NuxtLink>
          <div
            class="border-border-main bg-container-secondary flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border"
            @click="isModalOpen = true"
          >
            <NuxtImg
              src="/images/icons/SquaresFour.svg"
              alt="Lainnya"
              class="h-7 w-7"
            />
            <span class="text-body-4 text-center text-xs">{{
              TEXT.lainnya
            }}</span>
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
              isModalAbsenConfirmType === 'absenMasuk'
                ? TEXT.batal
                : TEXT.batal,
          },
        ]"
        @confirm="handleConfirmAbsen(isModalAbsenConfirmType)"
        @cancel="handleCloseModalAbsenConfirm"
        @close="handleCloseModalAbsenConfirm"
      >
        <div>{{ TEXT.apakahAndaYakinInginMelakukanAbsen }}</div>
      </ModalConfirmComponent>

      <ModalBottomComponent
        :title="TEXT.semuaMenu"
        :is-open="isModalOpen"
        @close="isModalOpen = false"
      >
        <div class="mt-4.5 grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="menu in mainMenu"
            :key="menu.id"
            class="border-border-main bg-container-secondary flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border"
            :to="menu.to"
          >
            <NuxtImg
              :src="`/images/icons/${menu.icon}.svg`"
              alt="Menu Icon"
              class="h-7 w-7"
            />
            <span class="text-body-4 text-center text-xs">{{ menu.name }}</span>
          </NuxtLink>
        </div>
      </ModalBottomComponent>

      <!-- Bottom Menu -->
      <BottomMenuComponent />
    </div>
  </ClientOnly>
</template>
